// models/Comment.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  userId: string; // User who made the comment
  bookId: Schema.Types.ObjectId; // Book being commented on
  comment: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    userId: { type: String, required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IComment>('Comment', commentSchema);