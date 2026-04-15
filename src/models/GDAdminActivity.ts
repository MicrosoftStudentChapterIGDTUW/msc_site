import mongoose, { Document, Model, Schema } from "mongoose";

export type AdminActivityAction =
  | "REGISTER"
  | "LOGIN"
  | "CREATE_GROUP"
  | "UPDATE_GROUP"
  | "FORCE_CLOSE_GROUP"
  | "REOPEN_GROUP"
  | "VIEW_RESULTS"
  | "PARTICIPANT_SUBMIT"
  | "AUTO_CLOSE_GROUP";

export interface IGDAdminActivity extends Document {
  adminId: string;
  adminEmail: string;
  action: AdminActivityAction;
  groupId?: string;
  details?: string;
  createdAt: Date;
}

const GDAdminActivitySchema = new Schema<IGDAdminActivity>(
  {
    adminId: { type: String, required: true, index: true },
    adminEmail: { type: String, required: true },
    action: {
      type: String,
      required: true,
      enum: [
        "REGISTER",
        "LOGIN",
        "CREATE_GROUP",
        "UPDATE_GROUP",
        "FORCE_CLOSE_GROUP",
        "REOPEN_GROUP",
        "VIEW_RESULTS",
        "PARTICIPANT_SUBMIT",
        "AUTO_CLOSE_GROUP",
      ],
    },
    groupId: { type: String, index: true },
    details: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const GDAdminActivity: Model<IGDAdminActivity> =
  mongoose.models.GDAdminActivity ||
  mongoose.model<IGDAdminActivity>("GDAdminActivity", GDAdminActivitySchema);
