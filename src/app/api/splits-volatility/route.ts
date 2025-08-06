import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Company from '@/models/Company';

export interface CompanyData {
  cid: number;
  companyname: string;
  market_capitalization: number
  splits?: {
    sales?: number[];
    operating_profit?: number[];
    net_profit?: number[];
    adjusted_pbt?: number[]
  };
  volatility?: {
    sales?: number;
    operating_profit?: number;
    adjusted_pbt?: number;
    adjusted_pat?: number;
  };
  splits_volatility: {
    sales?: number;
    operating_profit?: number;
    net_profit?: number;
    adjusted_pbt?: number;
  }
}


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const alpha_code = searchParams.get("alpha_code");
  
    if (!alpha_code) {
      return NextResponse.json(
        { success: false, message: "alpha_code is required" },
        { status: 400 }
      );
    }
  try {
    await connectDB();

    const company = await Company.findOne(
        { alpha_code },
        { market_capitalization: 1, splits: 1, volatility: 1, splits_volatility: 1, _id: 0 }
      ).lean<CompanyData>();
  
      if (!company) {
        return NextResponse.json(
          { success: false, message: "Company not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json({
        success: true,
        data: {
          market_capitalization: company.market_capitalization || 0,
          splits: company.splits || {},
          volatility: company.volatility || {},
          splits_volatility: company.splits_volatility || {}
        },
      });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
