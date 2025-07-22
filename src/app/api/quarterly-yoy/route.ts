import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const alpha_code = searchParams.get("alpha_code");
  
    if (!alpha_code) {
      return NextResponse.json(
        { success: false, message: "alpha_code is required" },
        { status: 400 }
      );
    }

    try {
        const response = await fetch(`https://screener-backend.alphaco.ai/summary?alpha_code=${alpha_code}`, {
            headers: {
                'x-secret-key': process.env.FORECASTER_SECRET_KEY!
            }
        });
        const data = await response.json();
        return NextResponse.json({
            success: true,
            data: data,
        });
    } catch (error) {
        console.error("Quarterly forecasting api error:", error);
        return NextResponse.json(
          { success: false, message: "Internal server error" },
          { status: 500 }
        );
    }
}