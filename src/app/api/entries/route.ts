import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import { Limit } from "@/models/Limit"

export async function GET(req: NextRequest) {
  const alpha_code = req.nextUrl.searchParams.get("q")?.trim()

  if (!alpha_code) {
    return NextResponse.json(
      { error: "Missing query param 'q'" },
      { status: 400 }
    )
  }

  try {
    await connectDB()
    const entry = await Limit.findOne({
      alpha_code: alpha_code.toUpperCase(),
    })
    return NextResponse.json({
      success: true,
      message: entry ? "Found entry" : "No entry found",
      data: entry || null,
    })
  } catch (err) {
    console.error("GET /api/entries error:", err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
