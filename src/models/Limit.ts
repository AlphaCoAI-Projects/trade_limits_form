import { Schema, model, models } from "mongoose"

const LimitSchema = new Schema({
  alpha_code: { type: String, required: true, unique: true },
  upper_limit: Number,
  lower_limit: Number,
  super_upper_limit: Number,
  super_lower_limit: Number,
  target_pe_lower: Number,
  target_pe_upper: Number,
})

export const Limit = models.Limit || model("Limit", LimitSchema, "limits")