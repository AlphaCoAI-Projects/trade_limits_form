import { NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import { Projection } from "@/models/Projection"

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

interface ProjectionDoc {
  alpha_code: string
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
      { "brokerage_consensus.FY26E": 1, alpha_code: 1, _id: 0 }
    ).lean<ProjectionDoc>()

    if (!projectionDoc?.brokerage_consensus?.FY26E) {
      return NextResponse.json(
        { success: false, message: "No FY26E data found" },
        { status: 200 }
      )
    }

    return NextResponse.json({
      success: true,
      alpha_code,
      FY26E: projectionDoc.brokerage_consensus.FY26E,
    })
  } catch (error) {
    console.error("Error fetching FY26E data:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
