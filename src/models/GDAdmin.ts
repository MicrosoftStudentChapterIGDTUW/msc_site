import mongoose, { Document, Model, Schema } from "mongoose";

export interface IGDAdmin extends Document {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

const GDAdminSchema = new Schema<IGDAdmin>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export const GDAdmin: Model<IGDAdmin> =
  mongoose.models.GDAdmin || mongoose.model<IGDAdmin>("GDAdmin", GDAdminSchema);
