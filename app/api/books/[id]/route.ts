import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongoose";
import BookModel from "@/app/models/Book.model";
import UserModel from "@/app/models/User.model";


export async function GET(req: Request, { params }: { params: { id: string } }) {
 
  
  try {
    await connectDB()
    const { id } = params;

    const book = await BookModel.findById(id);
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }
    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    return NextResponse.json({ message: "Error fetching book" }, { status: 500 });
  }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const { id } = params;
    const deletedBook = await BookModel.findByIdAndDelete(id);
    if (!deletedBook) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Book deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting book by ID:", error);
    return NextResponse.json({ message: "Error deleting book" }, { status: 500 });
  }
}
