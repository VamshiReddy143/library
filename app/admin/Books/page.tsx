"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader/loader";
import {Toaster,toast} from "react-hot-toast";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page state
  const adminUser = process.env.NEXT_PUBLIC_ADMIN === "vamshireddy19421@gmail.com";

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
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "An error occurred.");
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
      if (res.ok) {
      
        setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id)); 
        toast.success("Book has been deleted successfully");

      }
      
    
    } catch (error) {
      console.error(error);
      setDeleteMessage("Failed to delete the book.");
    }
  };

  // Filter books based on search query
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const booksPerPage = 8; // Number of books per page
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage); // Total pages
  const startIndex = (currentPage - 1) * booksPerPage; // Start index of current page
  const endIndex = startIndex + booksPerPage; // End index of current page
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex); // Books for the current page

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading)
    return (
      <div className="flex-col h-[100vh] gap-4 w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      {/* Search Bar */}
      <div className="relative mb-6 w-full mx-auto md:mx-0 bg-gray-100 rounded-2xl shadow-md p-1.5 transition-all duration-150 ease-in-out hover:scale-105 hover:shadow-lg">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-24 py-3 text-base text-gray-700 bg-transparent rounded-lg focus:outline-none"
          placeholder="Search for components, styles, creators..."
        />
        <button
          className="absolute right-1 top-1 bottom-1 px-6 bg-[#5044e4] text-white font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5044e4]"
        >
          Search
        </button>
      </div>

      {/* Header */}
      <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-8 text-center sm:text-left text-gray-900">
      <strong className="text-7xl">K</strong>eep The Story Going...
      </h1>

      {/* Delete Message */}
      {deleteMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {deleteMessage}
        </div>
      )}

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedBooks.length > 0 ? (
          paginatedBooks.map((book) => (
            <div key={book._id} className="space-y-4">
              {/* Book Cover */}
              <Link href={`/admin/Books/${book._id}`} aria-label={`View details of ${book.title}`}>
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  width={300}
                  height={400}
                  className="w-[300px] h-[400px] sm:h-[400px] object-cover shadow-[20px_20px_15px_rgba(0,0,0,0.3)] rounded-lg transition-transform duration-300 hover:scale-105"
                />
              </Link>
              {/* Book Details */}
              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{book.title}</h2>
                <p className="text-sm sm:text-base text-gray-600">Author: {book.author}</p>
                {/* Delete Button */}
                {adminUser && (
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    aria-label={`Delete ${book.title}`}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No books found matching your search.
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-300 transition-colors"
          >
            Next
          </button>
        </div>
      )}
      <Toaster/>
    </div>
  );
}