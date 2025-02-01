// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  clerkId: string; // Unique ID from Clerk
  name: string;
  email: string;
  profileImage: string;
  borrowedBooks?: string[]; // Array of Book IDs
  wishlist?: string[]; // Array of Book IDs
}

const userSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profileImage: { type: String, default: '' },
    borrowedBooks: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default UserModel;