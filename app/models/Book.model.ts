// models/Book.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  content?: string;
  available: boolean;
  comments: Schema.Types.ObjectId[];
}

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String },
    coverImage: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    available: { type: Boolean, default: true },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const BookModel = mongoose.models.Book || mongoose.model<IBook>("Book", bookSchema);

export default BookModel;