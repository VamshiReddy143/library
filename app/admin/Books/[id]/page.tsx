"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ✅ Use useParams for dynamic routes
import Image from "next/image";

interface Book {
  title: string;
  author: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  available: boolean;
  comments: { userId: string; text: string }[];
}

export default function BookDetailPage() {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const params = useParams(); // ✅ Get params from URL
  const id = params?.id as string; // ✅ Extract `id`

  useEffect(() => {
    if (!id) return; // Wait until `id` is available

    const fetchBook = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/books/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch the book");
        }
        const data = await response.json();
        setBook(data);
        console.log("Fetched Book Data:", data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]); // ✅ Fetch data when `id` changes

  if (loading) return <p>Loading book...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
        <Image
          src={book?.coverImage}
          alt="Book Cover"
          width={200}
          height={300}
        />
      <h1 className="text-3xl font-bold">{book?.title}</h1>
      <h2 className="text-xl text-gray-600">{book?.author}</h2>
      <div className="mt-4">
        <p>{book?.description}</p>
        <p className="mt-4">
          {book?.available ? (
            <a
              href={book?.pdfUrl}
              target="_blank"
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Read PDF
            </a>
          ) : (
            <span className="text-red-500">Currently Unavailable</span>
          )}
        </p>
        <div className="mt-6">
          <h3 className="text-2xl font-semibold">Comments</h3>
          {book?.comments && book?.comments?.length > 0 ? (
            <ul className="list-disc pl-5">
              {book.comments.map((comment, index) => (
                <li key={index}>
                  <strong>{comment.userId}: </strong>
                  {comment.text}
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
