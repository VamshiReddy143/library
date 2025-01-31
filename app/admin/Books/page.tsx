"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Book {
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

  const handleDelete=async(id:string)=>{
      try {
         const res=await fetch(`/api/books/${id}`,{
            method:"DELETE"
         })
         if(!res.ok){
            throw new Error("cannot delete the book")
         }

         const deletedBook=books.filter((book)=>book._id !== id)
         setBooks(deletedBook)
      } catch (error) {
        console.log(error)
      }
  }

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Books</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {books && books?.map((book) => (
          <div key={book.title} className="border p-4 rounded-lg">
          <Link href={`/admin/Books/${book._id}`}>
          <Image
              src={book.coverImage}
              alt={book.title}
              width={800}
              height={800}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
          </Link>
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p className="text-gray-500">Author:{book.author}</p>
            <button onClick={()=>handleDelete(book._id)}>delete</button>
            {/* {book.available ? (
              <a
                href={book.pdfUrl}
                target="_blank"
                className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Download
              </a>
            ) : (
              <p className="mt-4 text-red-500">Currently Unavailable</p>
            )} */}




            
  
            
          </div>
        ))}
      </div>
    </div>
  );
}
