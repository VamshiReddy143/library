// models/Book.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  available: boolean;
  comments: { userId: string; text: string }[];
}

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    available: { type: Boolean, default: true },
    comments: [
      {
        userId: { type: Schema.Types.ObjectId,ref: 'User'},
        text: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const BookModel = mongoose.models.Book || mongoose.model<IBook>("Book", bookSchema);

export default BookModel;