import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongoose";
import BookModel from "@/app/models/Book.model";
import UserModel from "@/app/models/User.model";
import { auth } from "@clerk/nextjs/server";
import Comment from "@/app/models/Comment";
import cloudinary from "@/app/components/cloudinary/cloudinary";

// Helper functions
async function fetchBookById(id: string) {
  const book = await BookModel.findById(id).populate("comments");
  if (!book) throw new Error("Book not found");
  return book;
}

async function fetchUserByClerkId(userId: string) {
  const user = await UserModel.findOne({ clerkId: userId });
  if (!user) throw new Error("User not found");
  return user;
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const id = request.nextUrl.pathname.split("/").pop(); // Extract ID from URL

    if (!id) {
      return NextResponse.json({ message: "Book ID is missing" }, { status: 400 });
    }

    // Find the book by ID
    const deletedBook = await BookModel.findById(id);
    if (!deletedBook) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    const isAdminUser = process.env.NEXT_PUBLIC_ADMIN === "vamshireddy19421@gmail.com";
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    if (deletedBook.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(deletedBook.imagePublicId);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
      }
    }

    await BookModel.findByIdAndDelete(id);
    return NextResponse.json({ message: "Book deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting book by ID:", error);
    return NextResponse.json(
      { message: "Error deleting book", error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const id = request.nextUrl.pathname.split("/").pop(); // Extract ID from URL

    if (!id) {
      return NextResponse.json({ message: "Book ID is missing" }, { status: 400 });
    }

    const book = await BookModel.findById(id).populate({
      path: "comments",
      populate: { path: "userId", select: "name email profileImage" },
    });

    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    const { userId } = await auth();
    let isBorrowed = false;
    let isLiked = false;
    if (userId) {
      const user = await UserModel.findOne({ clerkId: userId });
      if (user) {
        isBorrowed = user.borrowedBooks.includes(book._id);
        isLiked = user.wishlist.includes(book._id);
      }
    }

    return NextResponse.json({ book, isBorrowed, isLiked, comments: book.comments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { message: "Error fetching book", error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const id = request.nextUrl.pathname.split("/").pop(); // Extract ID from URL

    if (!id) {
      return NextResponse.json({ message: "Book ID is missing" }, { status: 400 });
    }

    const book = await fetchBookById(id);
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const user = await fetchUserByClerkId(userId);
    const { type } = await request.json();

    if (type === "borrow") {
      if (!user.borrowedBooks.includes(book._id)) {
        user.borrowedBooks.push(book._id);
        book.available = false;
      } else {
        user.borrowedBooks.pull(book._id);
        book.available = true;
      }
      await user.save();
      await book.save();
      return NextResponse.json({ message: "Book updated successfully" }, { status: 200 });
    } else if (type === "like") {
      if (!user.wishlist.includes(book._id)) {
        user.wishlist.push(book._id);
      } else {
        user.wishlist.pull(book._id);
      }
      await user.save();
      return NextResponse.json({ message: "Book updated successfully" }, { status: 200 });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { message: "Error updating book", error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const id = request.nextUrl.pathname.split("/").pop(); // Extract ID from URL

    if (!id) {
      return NextResponse.json({ message: "Book ID is missing" }, { status: 400 });
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Invalid JSON body:", error);
      return NextResponse.json({ message: "Invalid request body", error }, { status: 400 });
    }

    const { text } = body;
    if (!text || text.trim() === "") {
      return NextResponse.json({ message: "Comment cannot be empty" }, { status: 400 });
    }
    if (text.length > 500) {
      return NextResponse.json({ message: "Comment exceeds maximum length of 500 characters" }, { status: 400 });
    }

    const user = await fetchUserByClerkId(userId);
    const book = await fetchBookById(id);

    const newComment = await Comment.create({
      userId: user._id,
      bookId: id,
      comment: text,
    });

    const populatedComment = await newComment.populate("userId", "name email profileImage");

    book.comments.push(newComment._id);
    await book.save();

    return NextResponse.json({ message: "Comment added successfully", comment: populatedComment }, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { message: "Error adding comment", error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
