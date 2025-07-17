import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import { Limit } from "@/models/Limit"

type Params = Promise<{ alpha_code: string }>;

export async function POST(
  req: NextRequest,
  company: { params: Params }
) {
  const { alpha_code } = await company.params
  if (!alpha_code) {
    return NextResponse.json({ error: "Missing alpha_code" }, { status: 400 })
  }

  const body = await req.json()
  const alphaCode = alpha_code.toUpperCase()

  const toNullableFloat = (val: string | number | null | undefined) =>
    val === null || val === undefined || val === "" ? null : parseFloat(val.toString())

  try {
    await connectDB()

    const update = {
      alpha_code: alphaCode,
      upper_limit: toNullableFloat(body.upper_limit),
      lower_limit: toNullableFloat(body.lower_limit),
      super_upper_limit: toNullableFloat(body.super_upper_limit),
      super_lower_limit: toNullableFloat(body.super_lower_limit),
      target_pe_lower: toNullableFloat(body.target_pe_lower),
      target_pe_upper: toNullableFloat(body.target_pe_upper),
    }

    const result = await Limit.findOneAndUpdate(
      { alpha_code: alphaCode },
      { $set: update },
      { upsert: true, new: true }
    )

    return NextResponse.json({
      success: true,
      message: result ? "Created or updated PAT entry" : "Failed to update",
    })
  } catch (error) {
    console.error("POST /api/entries/[alpha_code] error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
