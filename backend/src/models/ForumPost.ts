import mongoose, { Document, Schema } from "mongoose";

export interface IComment {
  authorId: mongoose.Types.ObjectId;
  text: string;
  createdAt?: Date;
}

export interface IForumPost extends Document {
  authorId: mongoose.Types.ObjectId;
  title?: string;
  body: string;
  tags?: string[];
  collegeName?: string;
  comments: IComment[];
  isAnonymous?: boolean;
  upvotes: number;
}

const CommentSchema = new Schema<IComment>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

const ForumPostSchema = new Schema<IForumPost>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    body: { type: String, required: true },
    tags: [String],
    collegeName: String,
    comments: [CommentSchema],
    isAnonymous: { type: Boolean, default: false },
    upvotes: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const ForumPost = mongoose.model<IForumPost>("ForumPost", ForumPostSchema);
