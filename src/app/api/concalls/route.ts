import { NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import { Projection } from "@/models/Projection"

export interface Concall {
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
}

export interface ProjectionType {
  alpha_code: string
  concalls?: Concall[]
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

    const projectionDoc = await Projection.findOne({ alpha_code }).lean<ProjectionType>()

    if (!projectionDoc?.concalls?.length) {
      return NextResponse.json({ error: "No concalls found" }, { status: 200 })
    }

    const filteredConcalls = projectionDoc.concalls
      .filter((c) => c.processed === "processed" && c.projections && Object.keys(c.projections).length > 0)
      .map(({ year_id, quarter_id, projections }) => ({
        year_id,
        quarter_id,
        projections,
      }))

    return NextResponse.json({
      alpha_code,
      concalls: filteredConcalls,
    })
  } catch (e) {
    console.error("Error fetching projections:", e)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
