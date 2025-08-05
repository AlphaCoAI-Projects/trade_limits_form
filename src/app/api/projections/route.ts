import { NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import { Projection } from "@/models/Projection"

interface Concall {
  year_id: number
  quarter_id: string
  processed: string
  projections?: {
    [fy: string]: {
      ebitda: number | null
      ebitda_margin: number | null
      total_revenue: number | null
      revenue_growth: number | null
      is_interest_included: boolean
      is_other_income_included: boolean
      annualized_interest: number | null
      annualized_depreciation: number | null
      other_income: number | null
      profit_after_tax: number | null
    }
  }
  documents: {
    type_of_concall: string
    url: string
    published_date: string
  }[]
}

interface BrokerageConsensus {
  FY26E?: {
    avg_revenue_from_operations?: number
    avg_ebitda?: number
    avg_other_income?: number
    avg_pbt?: number
    avg_exceptional_items?: number
    avg_tax?: number
    avg_pat?: number
    avg_adj_pat?: number
    avg_earning_multiple?: number
  }
}

interface ProjectionType {
  alpha_code: string
  concalls?: Concall[]
  brokerage_consensus?: BrokerageConsensus
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const alpha_code = searchParams.get("alpha_code")

  if (!alpha_code) {
    return NextResponse.json(
      { success: false, message: "alpha_code is required" },
      { status: 400 }
    )
  }

  try {
    await connectDB()

    const projectionDoc = await Projection.findOne(
      { alpha_code },
      {"brokerage_consensus.FY26E": 1, alpha_code: 1, "concalls": 1, _id: 0}
    ).lean<ProjectionType>()

    if (!projectionDoc?.concalls?.length && !projectionDoc?.brokerage_consensus) {
      return NextResponse.json({ data: {},success: false,}, { status: 200 })
    }

    return NextResponse.json({
      success: true,
      alpha_code,
      data: projectionDoc,
    })
    
  } catch (e) {
    console.error("Error fetching projections:", e)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
