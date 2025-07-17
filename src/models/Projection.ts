import mongoose, { Schema, Document, models, model } from "mongoose";

interface Concall {
  year_id: number;
  quarter_id: number;
  processed: string;
  projections: {
    FY26?: Record<string, any>; 
  };
}

export interface ProjectionDoc extends Document {
  alpha_code: string;
  concalls: Concall[];
}

const ConcallSchema = new Schema<Concall>(
  {
    year_id: Number,
    quarter_id: Number,
    processed: String,
    projections: {
      FY26: Schema.Types.Mixed,
    },
  },
  { _id: false }
);

const ProjectionSchema = new Schema<ProjectionDoc>({
  alpha_code: { type: String, required: true, unique: true },
  concalls: [ConcallSchema],
});

export const Projection =
  models.Projection || model<ProjectionDoc>("Projection", ProjectionSchema);
