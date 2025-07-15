import { Schema, model, models } from "mongoose"

const LimitSchema = new Schema({
  alpha_code: { type: String, required: true, unique: true },
  upper_limit: Number,
  lower_limit: Number,
  super_upper_limit: Number,
  super_lower_limit: Number,
  lower_band: Number,
  median_band: Number,
  upper_band: Number,
})

export const Limit = models.Limit || model("Limit", LimitSchema, "limits")