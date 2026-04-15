import mongoose, { Document, Model, Schema } from "mongoose";

export interface IGDEvaluation extends Document {
  groupId: string; 
  evaluatorId: string; 
  evaluateeId: string;
  ratings: number[]; // Array of ratings corresponding to frontend labels (e.g. [4, 5, 3, 2, 5, 4, 3])
  contributionType: string;
  isTeamPlayer: boolean;
  strength: string;
  improvement: string;
  createdAt: Date;
}

const GDEvaluationSchema = new Schema<IGDEvaluation>(
  {
    groupId: { type: String, required: true, index: true },
    evaluatorId: { type: String, required: true },
    evaluateeId: { type: String, required: true },
    ratings: [Number], // Array of ratings corresponding to frontend labels
    contributionType: { type: String, required: true },
    isTeamPlayer: { type: Boolean, required: true },
    strength: { type: String, required: true },
    improvement: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Ensure a participant cannot evaluate the same peer twice in one session
GDEvaluationSchema.index({ groupId: 1, evaluatorId: 1, evaluateeId: 1 }, { unique: true });

export const GDEvaluation: Model<IGDEvaluation> =
  mongoose.models.GDEvaluation || mongoose.model<IGDEvaluation>("GDEvaluation", GDEvaluationSchema);
