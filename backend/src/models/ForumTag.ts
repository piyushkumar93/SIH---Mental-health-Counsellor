import mongoose, { Document, Schema } from 'mongoose'

export interface IForumTag extends Document {
  name: string
  description?: string
  createdBy: mongoose.Types.ObjectId
}

const ForumTagSchema = new Schema<IForumTag>(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
)

export const ForumTag = mongoose.model<IForumTag>('ForumTag', ForumTagSchema)
