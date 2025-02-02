"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { IoShareSocialOutline } from "react-icons/io5";
import { MdFileDownload } from "react-icons/md";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import {Toaster, toast} from "react-hot-toast";
import Loader from "@/components/Loader/loader";

interface User {
  name: string;
  email: string;
  profileImage?: string;
}

interface Comment {
  userId: User;
  text: string;
  comment: string
}


interface Book {
  title: string;
  author: string;
  description: string;
  coverImage: string;
  content: string;
  pdfUrl: string;
  available: boolean;
  comments: Comment[]
}

export default function BookDetailPage() {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isBorrowed, setIsBorrowed] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>(""); // State for new comment input
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);

  const params = useParams();
  const id = params?.id as string;

  // Clerk Authentication
  const { userId, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/books/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch the book");
        }
        const data = await response.json();
        console.log(data.comments)
        setBook(data.book); // Set the entire book object, including comments
        setIsBorrowed(data.isBorrowed);
        setIsLiked(data.isLiked);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !isSignedIn) return;

    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment }),
      });

      if (response.ok) {
        const data = await response.json();
        setBook((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            comments: [...prev.comments, data.comment], // Append the new comment
          };
        });
        toast.success("Comment added successfully");
        setNewComment(""); // Clear the input field
      } else {
        const errorData = await response.json();
        console.error(errorData.message);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };


  const handleBorrow = async () => {
    if (!userId || !isSignedIn) return;
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "borrow" }),
      });
      if (response.ok) {
        setIsBorrowed((prev) => !prev); // Toggle borrowing status
        toast.success("Book updated successfully");
      } else {
        const data = await response.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error borrowing book:", error);
    }
  };

  const handleLike = async () => {
    if (!userId || !isSignedIn) return;
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "like" }),
      });
      if (response.ok) {
        setIsLiked((prev) => !prev); // Toggle liking status
        toast.success("Book updated successfully");
      } else {
        const data = await response.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error liking book:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      // Use Web Share API if supported
      try {
        await navigator.share({
          title: book?.title || "Book Title",
          text: `Check out this book: ${book?.title} by ${book?.author}`,
          url: window.location.href, // Share the current page URL
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: Copy the URL to the clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    }
  };


  if (loading)
    return (
       <div  className="flex-col h-[100vh] gap-4 w-full flex items-center justify-center">
        <Loader/>
       </div>
    );
  if (!isSignedIn) return <p className="text-center text-red-500">You need to sign in to view this page.</p>;
  if (loading)
    return (
       <div  className="flex-col h-[100vh] gap-4 w-full flex items-center justify-center">
        <Loader/>
       </div>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (


    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Book Header */}
      <div className="flex flex-col md:flex-row  items-center">
        {/* Book Cover */}
        <div className="relative w-full md:w-1/3">
          <Image
            src={book?.coverImage || "/placeholder.jpg"}
            alt="Book Cover"
            width={300}
            height={400}
            className="w-[300px] h-[400px] sm:h-[400px] sm:w-[250px] object-cover rounded-lg shadow-[20px_20px_15px_rgba(0,0,0,0.3)] transform hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Book Details */}
        <div className="w-full md:w-2/3 space-y-4 mt-6">
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-gray-900">
            {book?.title}
          </h1>
          <h2 className="text-lg sm:text-xl text-gray-700">{book?.author}</h2>
          <p className="text-sm sm:text-base text-gray-600">{book?.content}</p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              {isBorrowed ? (
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md cursor-pointer"
                  onClick={handleBorrow}
                >
                  Return
                </button>
              ) : (
                <PulsatingButton
                  className="px-4 py-2 rounded-md cursor-pointer "
                  onClick={handleBorrow}
                >
                  Borrow
                </PulsatingButton>
              )}
            </div>
            <div className="flex gap-4">



              <button
                className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors"
                onClick={() => {
                  try {
                    if (!book?.pdfUrl) {
                      console.error("PDF URL is not available.");
                      return;
                    }
                    const link = document.createElement("a");
                    link.href = book?.pdfUrl;
                    link.setAttribute("download", "Book.pdf");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  } catch (error) {
                    console.error("Download error:", error);
                  }
                }}
              >
                <MdFileDownload className="h-6 w-6 text-gray-600" />
              </button>



              <button
                onClick={handleLike}
                className={`bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors ${isLiked ? "bg-red-500 text-white" : ""
                  }`}
              >
                {isLiked ? (
                  <FaHeart className="h-6 w-6" />
                ) : (
                  <FaRegHeart className="h-6 w-6 text-gray-600" />
                )}
              </button>
              <button
                onClick={handleShare}
                className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors"
              >
                <IoShareSocialOutline className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Description and Comments */}
      <div className="mt-8 space-y-6">
        {/* Description */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Description</h2>
          <p className="text-sm sm:text-base text-gray-700">{book?.description}</p>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Comments</h3>
          <form onSubmit={handleAddComment} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                Post
              </button>
            </div>
          </form>

          {book?.comments && book?.comments.length > 0 ? (
            <ul className="space-y-2">
              {book.comments.map((comm, index) => (
                <li key={index} className="flex gap-2">
                  <Image
                    src={comm.userId?.profileImage || "/placeholder.jpg"}
                    alt="Profile"
                    width={40}
                    height={40}
                    loading="lazy"
                    className="rounded-full"
                  />
                  <div className="flex flex-col">
                    <strong className="text-gray-800">{comm?.userId?.name}</strong>
                    <span className="text-sm sm:text-base text-gray-600">{comm?.comment}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Download Confirmation
            </h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              Are you sure you want to download <strong>{book?.title}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = book?.pdfUrl || "#";
                  link.setAttribute("download", `${book?.title || "book"}.pdf`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  setShowDownloadModal(false);
                }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster/>
    </div>
  );
}

;
