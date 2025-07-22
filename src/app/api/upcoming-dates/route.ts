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

export async function GET() {
  try {
    await connectDB()

    const dates = await UpcomingResults.find({}, { date: 1, _id: 0 }).lean()

    const parsedDates = dates
      .map((doc) => doc.date?.toISOString())
      .filter(Boolean)

    return NextResponse.json({
      success: true,
      data: parsedDates,
    })
  } catch (error) {
    console.error("Error fetching dates:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
