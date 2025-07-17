import { NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import { Projection } from "@/models/Projection"

export interface Concall {
  year_id: number
  quarter_id: string
  processed: string
  projections?: {
    FY26?: {
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

    const projectionDoc = await Projection.findOne({
      alpha_code,
    }).lean<ProjectionType>()

    if (!projectionDoc?.concalls?.length)
      return NextResponse.json({ error: "No concalls found" }, { status: 404 })

    const fy26Concall = projectionDoc.concalls
      .filter(
        (c) =>
          c.year_id === 2026 &&
          c.processed === "processed" &&
          c.projections?.FY26
      )
      .sort((a, b) => {
        const qA = Number(a.quarter_id.replace("q", ""))
        const qB = Number(b.quarter_id.replace("q", ""))
        return qB - qA
      })[0]

    if (!fy26Concall?.projections?.FY26)
      return NextResponse.json(
        { error: "No FY26 projections in concalls" },
        { status: 200 }
      )

    return NextResponse.json({
      alpha_code,
      FY26: fy26Concall.projections.FY26,
    })
  } catch (e) {
    console.error("Error fetching FY26 projection:", e)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
