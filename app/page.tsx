"use client";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MorphingText } from "@/components/ui/morphing-text"

// Define a type for the Book object
interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
}

// Utility function to shuffle an array using Fisher-Yates algorithm
const shuffleArray = (array: Book[]): Book[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Page = () => {
  // Use the Book type for state variables
  const [books, setBooks] = useState<Book[]>([]);
  const [newSeriesBook, setNewSeriesBook] = useState<Book | null>(null); // State for the new series book
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();


  const texts = [
    "Welcome",
    "Read 📚",
    "Learn📖",
    "Grow🧑‍🎓",
    "❤️",
    

  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/books", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        if (data && Array.isArray(data.books)) {
          // Shuffle the books array and take the first 5 books
          const shuffledBooks = shuffleArray(data.books).slice(0, 4);
          setBooks(shuffledBooks);
          // Select one random book for the "New Series Collection"
          const randomBook = shuffledBooks[0]; // First book from shuffled array
          setNewSeriesBook(randomBook || null); // Ensure it's null if no book is available
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching books.");
      }
    };
    fetchData();
  }, []);

  // Filter books based on search query
  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 px-3">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="w-full md:w-1/2">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-4 text-center md:text-left">
            <span
              className="inline-block font-bold text-[5rem] sm:text-[5rem] md:text-[7rem]"
              style={{
                WebkitTextStroke: "1px black", // Adds a black border around the text
                // WebkitTextFillColor: "transparent", // Removes the fill color
              }}
            >
              H
            </span>
            <strong className=" text-5xl md:text-7xl">
              {"ello "}
            </strong>
            <strong className="text-red-500 text-5xl md:text-7xl">
              {user?.firstName}👋
            </strong>
          </h1>
          <MorphingText className="text-4xl sm:text-2xl  sm:mt-10  md:text-2xl sm:text-left text-center" texts={texts} />
          <p className="mt-5 text-lg md:text-xl text-center md:text-left">
            Our library is open for you. We have a wide range of books to choose from and a wide variety of genres.Also, we have a collection of new series books that you can start reading right away.
          </p>
          <Link href="/admin/Books">
            <div className="flex justify-center md:justify-start mt-6">
              <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors">
                Start Reading
              </button>
            </div>
          </Link>
        </div>
        <div className="flex justify-center">
          <Image
            src="/assets/redimagebook.png"
            alt="Picture of an open book"
            width={700}
            height={800}
            loading="lazy"
            className="rounded-lg sm:h-[500px] sm:w-[600px] transition-transform duration-300 hover:scale-105 hover:rotate-2"
          />
        </div>

      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-[480px] mx-auto md:mx-0  bg-gray-100 rounded-2xl shadow-md p-1.5 transition-all duration-150 ease-in-out hover:scale-105 hover:shadow-lg">
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
        <button className="absolute right-1 top-1 bottom-1 px-6 bg-[#5044e4] text-white font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5044e4]">
          Search
        </button>
      </div>

      {/* Popular Books Section */}
      <div className="mt-10">
        <h1 className="text-2xl uppercase sm:text-start md:text-3xl font-bold text-center mb-4">Popular Now</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 gap-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div key={book._id} className="space-y-4">
                {/* Book Cover */}
                <Link href={`/admin/Books/${book._id}`} aria-label={`View details of ${book.title}`}>
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    width={200}
                    height={300}
                    loading="lazy"
                    className="w-[300px] h-[400px] object-cover shadow-[20px_20px_15px_rgba(0,0,0,0.3)] rounded-lg transition-transform duration-300 hover:scale-105"
                  />
                </Link>
                {/* Book Details */}
                <div className="space-y-2">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">{book.title}</h2>
                  <p className="text-sm md:text-base text-gray-600">Author: {book.author}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No books found matching your search.</p>
          )}
        </div>
      </div>

      {/* New Series Collection Section */}
      <div className="mt-12 mb-10">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-center">New Series Collection</h1>
        {newSeriesBook ? (
          <div className="mt-6 flex flex-col md:flex-row items-center gap-6">
            {/* Book Cover */}
            <Link href={`/admin/Books/${newSeriesBook._id}`} aria-label={`View details of ${newSeriesBook.title}`}>
              <Image
                src={newSeriesBook.coverImage}
                alt={newSeriesBook.title}
                width={100}
                height={150}
                loading="lazy"
                className="w-[100px] h-[150px] object-cover shadow-[20px_20px_15px_rgba(0,0,0,0.3)] rounded-lg transition-transform duration-300 hover:scale-105"
              />
            </Link>
            {/* Book Details */}
            <div className="space-y-2">
              <h2 className="text-lg md:text-2xl font-semibold text-gray-800">{newSeriesBook.title}</h2>
              <p className="text-sm md:text-base text-gray-600">Author: {newSeriesBook.author}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">Loading new series collection...</p>
        )}
      </div>
    </div>
  );
};

export default Page