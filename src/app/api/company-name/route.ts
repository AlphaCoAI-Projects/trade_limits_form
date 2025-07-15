import { BASE_URL } from "@/lib/config"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")

  if (!query) {
    return new Response("Missing query parameter", { status: 400 })
  }

  try {
    const response = await fetch(
      `${BASE_URL}/data/get_company_name/${encodeURIComponent(query)}`
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data from backend" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}
