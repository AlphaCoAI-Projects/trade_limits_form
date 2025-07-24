import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const alphaCode = searchParams.get("alpha_code")
  const k = searchParams.get("k")
  const windowSize = searchParams.get("window_size")

  if (!alphaCode || !k || !windowSize) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Missing required query parameters: alpha_code, k, or window_size.",
      },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/bollinger?alpha_code=${alphaCode}&k=${k}&window_size=${windowSize}`,
      {
        headers: {
          "x-secret-key": process.env.FORECASTER_SECRET_KEY!,
        },
      }
    )
    const result = await response.json()
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to fetch Bollinger Bands: ${
            result?.detail ?? "Unknown error"
          }`,
          data: result,
        },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully fetched Bollinger Bands for alpha_code: ${alphaCode}`,
      data: result,
    })
  } catch (err) {
    console.error("Error fetching bollinger bands:", err)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while fetching Bollinger Bands.",
      },
      { status: 500 }
    )
  }
}
