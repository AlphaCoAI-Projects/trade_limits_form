import { NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import mongoose from "mongoose"

const upcomingResultsSchema = new mongoose.Schema(
  {
    date: Date,
    list: [
      {
        alpha_code: String,
        company_name: String,
      },
    ],
  },
  { collection: "upcoming_results_screener", versionKey: false }
)

const UpcomingResults = mongoose.models.UpcomingResults || mongoose.model("UpcomingResults", upcomingResultsSchema)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get("q")

  if (!date) {
    return NextResponse.json(
      { success: false, message: "Date query param is required" },
      { status: 400 }
    )
  }

  try {
    await connectDB()

    const parsedDate = new Date(date)
    const result = await UpcomingResults.findOne({ date: parsedDate }, { _id: 0 })

    if (!result) {
      return NextResponse.json(
        { success: false, message: "No company list found for the given date" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Error fetching companies by date:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
