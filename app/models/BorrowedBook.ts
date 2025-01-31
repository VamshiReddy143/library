// models/BorrowedBook.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IBorrowedBook extends Document {
  userId: string; // User who borrowed the book
  bookId: Schema.Types.ObjectId; // Book that was borrowed
  borrowedDate: Date;
  returnDate: Date | null;
}

const borrowedBookSchema = new Schema<IBorrowedBook>(
  {
    userId: { type: String, required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    borrowedDate: { type: Date, default: Date.now },
    returnDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<IBorrowedBook>('BorrowedBook', borrowedBookSchema);