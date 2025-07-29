import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const alpha_code = searchParams.get("alpha_code")

  if (!alpha_code) {
    return NextResponse.json({
      success: false,
      message: "Parameter alpha_code missing",
    })
  }

  try {
    const response = await fetch(
      `https://screener-backend.alphaco.ai/get_mcap?alpha_code=${alpha_code}`
    )
    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to fetch market cap: ${
            result?.detail ?? "Unknown error"
          }`,
          data: result,
        },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully fetched market cap for alpha_code: ${alpha_code}`,
      data: result,
    })
  } catch (error) {
    console.error("Error fetching bollinger bands:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while fetching market cap.",
      },
      { status: 500 }
    )
  }
}
