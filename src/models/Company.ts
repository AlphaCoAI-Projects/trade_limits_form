import mongoose, { Schema, Document } from 'mongoose';

interface CompanyDoc extends Document {
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

const CompanySchema = new Schema<CompanyDoc>({
  cid: Number,
  companyname: String,
  market_capitalization: Number,
  splits: {
    sales: [Number],
    operating_profit: [Number],
    net_profit: [Number],
  },
  volatility: {
    sales: Number,
    operating_profit: Number,
    adjusted_pbt: Number,
    adjusted_pat: Number,
  },
  splits_volatility: {
    sales: Number,
    operating_profit: Number,
    adjusted_pbt: Number,
    net_profit: Number,
  }
});

export default mongoose.models.Company || mongoose.model<CompanyDoc>('Company', CompanySchema);
