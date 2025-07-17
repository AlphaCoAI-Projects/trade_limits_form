import mongoose, { Schema, model, models } from "mongoose"

const FyEstimateSchema = new Schema(
  {
    avg_revenue_from_operations: Number,
    avg_ebitda: Number,
    avg_other_income: Number,
    avg_pbt: Number,
    avg_exceptional_items: Number,
    avg_tax: Number,
    avg_pat: Number,
    avg_adj_pat: Number,
    avg_earning_multiple: Number,
  },
  { _id: false }
)

const ProjectionSchema = new Schema(
  {
    alpha_code: { type: String, required: true },
    company_name: String,
    brokerage_consensus: {
      FY26E: FyEstimateSchema,
    },
  },
  { timestamps: true }
)

export const Projection =
  models.Projection || model("Projection", ProjectionSchema)
