// models/Comment.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  userId: Schema.Types.ObjectId; // User who made the comment
  bookId: Schema.Types.ObjectId; // Book being commented on
  comment: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    comment: { type: String, required: true },
  
  },
  { timestamps: true }
);

const Comment= mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema);

export default Comment;