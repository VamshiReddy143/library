import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import connectDB from "../lib/mongoose";
import UserModel from "../models/User.model";

// Define a type for the Book object
interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
}

// Reusable Book Card Component
const BookCard = ({ book }: { book: Book }) => (
  <Link href={`/books/${book._id}`} key={book._id} aria-label={`View details of ${book.title}`}>
    <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <Image
        src={book.coverImage}
        alt={`Cover image of ${book.title}`}
        width={200}
        height={300}
        loading="lazy"
        className="object-cover w-full h-[20em] rounded-lg mb-2"
      />
      <div className="p-4 bg-white dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-red-500 transition-colors">
          {book.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{book.author}</p>
      </div>
    </div>
  </Link>
);

// Reusable Empty State Component
const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-16 text-gray-400 dark:text-gray-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
    <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
  </div>
);

export default async function ProfilePage() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  // Redirect to sign-in if user is not authenticated
  if (!userId || !clerkUser) redirect("/sign-in");

  let dbUser;
  try {
    // Connect to MongoDB
    await connectDB();

    // Find or create user in MongoDB
    dbUser = await UserModel.findOne({ clerkId: userId })
      .populate<{ wishlist: Book[] }>("wishlist"); // Use TypeScript generics for type safety

    if (!dbUser) {
      dbUser = await UserModel.create({
        clerkId: userId,
        name:
          clerkUser.username ||
          `user_${clerkUser.firstName?.toLowerCase()}${Math.floor(Math.random() * 1000)}`,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        profileImage: clerkUser.imageUrl,
      });
    }
  } catch (error) {
    console.error("Database error:", error);
    return <p className="text-red-500 text-center">An error occurred while loading your profile.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      {/* Wishlist Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Your Wishlist</h2>
        {dbUser.wishlist && dbUser.wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dbUser.wishlist.map((book: Book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <EmptyState message="No books in wishlist." />
        )}
      </section>
    </div>
  );
}