import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import { Limit } from "@/models/Limit"

export async function GET(req: NextRequest) {
  const rawCodes = req.nextUrl.searchParams.get("codes")?.trim()

  if (!rawCodes) {
    return NextResponse.json(
      { success: false, message: "Query param 'codes' is required" },
      { status: 400 },
    )
  }

  // split by comma, remove blanks, uppercase, dedupe
  const codes = Array.from(
    new Set(
      rawCodes
        .split(",")
        .map((c) => c.trim().toUpperCase())
        .filter(Boolean),
    ),
  )

  if (codes.length === 0) {
    return NextResponse.json(
      { success: false, message: "No valid alpha codes supplied" },
      { status: 400 },
    )
  }

  try {
    await connectDB()

    /** only grab the columns you need */
    const limits = await Limit.find(
      { alpha_code: { $in: codes } },
      {
        _id: 0,
        alpha_code: 1,
        upper_limit: 1,
        lower_limit: 1,
        super_upper_limit: 1,
        super_lower_limit: 1,
        target_pe_lower: 1,
        target_pe_upper: 1,
        industry_pe: 1,
      },
    ).lean()

    // convert to { AX11111: { …limits }, AX22222: { …limits } }
    const map: Record<string, any> = {}
    limits.forEach((l) => {
      map[l.alpha_code] = { ...l }
      delete map[l.alpha_code].alpha_code
    })

    return NextResponse.json({ success: true, data: map })
  } catch (err) {
    console.error("GET /api/get-all-limits error:", err)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    )
  }
}
