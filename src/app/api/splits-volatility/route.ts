import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Company from '@/models/Company';

export interface CompanyData {
  cid: number;
  companyname: string;
  splits?: {
    sales?: number[];
    operating_profit?: number[];
    net_profit?: number[];
  };
  volatility?: {
    sales?: number;
    operating_profit?: number;
    adjusted_pbt?: number;
    adjusted_pat?: number;
  };
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
        { splits: 1, volatility: 1, _id: 0 }
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
          splits: company.splits || {},
          volatility: company.volatility || {},
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
