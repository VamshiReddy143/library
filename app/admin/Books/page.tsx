"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  available: boolean;
}

export default function BooksDisplay() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [deleteMessage, setDeleteMessage] = useState<string>("");

  useEffect(() => {
    // Fetch books from the API
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books");
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        setBooks(data.books);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Cannot delete the book");
      }
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
      setDeleteMessage(`Book with ID ${id} has been deleted.`);
    } catch (error) {
      console.error(error);
      setDeleteMessage("Failed to delete the book.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <h1 className="text-4xl font-serif font-bold mb-8 text-gray-900">
        Keep The Story Going...
      </h1>

      {/* Delete Message */}
      {deleteMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {deleteMessage}
        </div>
      )}

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
        {books.map((book) => (
          <div key={book._id} className="space-y-4">
            {/* Book Cover */}
            <Link href={`/admin/Books/${book._id}`} aria-label={`View details of ${book.title}`}>
              <Image
                src={book.coverImage}
                alt={book.title}
                width={800}
                height={800}
                className="w-[300px] h-[400px] rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:scale-105"
              />
            </Link>

            {/* Book Details */}
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-800">{book.title}</h2>
              <p className="text-gray-600">Author: {book.author}</p>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(book._id)}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                aria-label={`Delete ${book.title}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}