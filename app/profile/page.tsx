import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import connectDB from '../lib/mongoose';
import UserModel from '../models/User.model';

export default async function ProfilePage() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  // Redirect to sign-in if user is not authenticated
  if (!userId || !clerkUser) redirect('/sign-in');

  // Connect to MongoDB
  await connectDB();

  // Find or create user in MongoDB
  let dbUser = await UserModel.findOne({ clerkId: userId })
    .populate('borrowedBooks') // Populate borrowed books
    .populate('wishlist'); // Populate wishlist books

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

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="flex items-start gap-6 mb-8">
        <Image
          width={96}
          height={96}
          src={clerkUser.imageUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {clerkUser.firstName} {clerkUser.lastName}
          </h1>
          <p className="text-gray-600">@{dbUser.name}</p>
          <p className="mt-2 text-gray-600">
            {clerkUser.emailAddresses[0]?.emailAddress}
          </p>
        </div>
      </div>

      {/* Borrowed Books Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Borrowed Books</h2>
        {dbUser.borrowedBooks && dbUser.borrowedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {dbUser.borrowedBooks.map((book: any) => (
              <Link href={`/books/${book._id}`} key={book._id}>
                <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    width={200}
                    height={300}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-lg font-semibold">{book.title}</h3>
                  <p className="text-gray-600">{book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No borrowed books.</p>
        )}
      </section>

      {/* Wishlist Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Wishlist</h2>
        {dbUser.wishlist && dbUser.wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {dbUser.wishlist.map((book: any) => (
              <Link href={`/books/${book._id}`} key={book._id}>
                <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    width={200}
                    height={300}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-lg font-semibold">{book.title}</h3>
                  <p className="text-gray-600">{book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No books in wishlist.</p>
        )}
      </section>
    </div>
  );
}