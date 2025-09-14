import mongoose, { Document, Schema } from "mongoose";

export interface IAnalytics extends Document {
  timestamp: Date;
  totalAppointments?: number;
  collegeId?: string;
  resourcesConsumed?: number;
  distressedKeywords?: string[]; // from chatbot (we won't implement chatbot)
  forumPostsCount?: number;
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    timestamp: { type: Date, default: Date.now },
    totalAppointments: Number,
    collegeId: String,
    resourcesConsumed: Number,
    distressedKeywords: [String],
    forumPostsCount: Number
  },
  { timestamps: true }
);

export const Analytics = mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);
