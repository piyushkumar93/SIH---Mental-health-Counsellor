import mongoose, { Document, Schema } from "mongoose";

export interface IAppointment extends Document {
  collegeName: string;
  userId: mongoose.Types.ObjectId;
  counsellorId?: mongoose.Types.ObjectId;
  scheduledAt: Date;
  createdAt: Date;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    collegeName: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    counsellorId: { type: Schema.Types.ObjectId, ref: "Counsellor" },
    scheduledAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending"
    },
    notes: String
  },
  { timestamps: true }
);

export const Appointment = mongoose.model<IAppointment>("Appointment", AppointmentSchema);
