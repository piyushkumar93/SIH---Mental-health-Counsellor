import mongoose, { Document, Schema } from "mongoose";

export interface ICounsellor extends Document {
  collegeName: string;
  name: string;
  phone?: string;
  roomNumber?: string;
  email?: string;
  gender?: string;
  designation?: string;
  rating?: number;
  userId?: mongoose.Types.ObjectId; // (optional) linked user account
}

const CounsellorSchema = new Schema<ICounsellor>(
  {
    collegeName: { type: String, required: true },
    name: { type: String, required: true },
    phone: String,
    roomNumber: String,
    email: String,
    gender: String,
    designation: String,
    rating: { type: Number, default: 0 },
    userId: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export const Counsellor = mongoose.model<ICounsellor>("Counsellor", CounsellorSchema);
