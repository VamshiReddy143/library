"use client";

import Image from "next/image";
import { useState } from "react";

export default function AdminPage() {
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    description: "",
    content: "",
    available: true,
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (e.target.name === "coverImage") setCoverImage(file);
    if (e.target.name === "pdfFile") setPdfFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverImage || !pdfFile) {
      setMessage({ text: "Please select both an image and a PDF file", type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("title", bookData.title);
    formData.append("author", bookData.author);
    formData.append("description", bookData.description);
    formData.append("content", bookData.content);
    formData.append("available", String(bookData.available));
    formData.append("coverImage", coverImage);
    formData.append("pdfFile", pdfFile);

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload book");

      setMessage({ text: "Book uploaded successfully!", type: "success" });
      setBookData({ title: "", author: "", description: "", content: "", available: true });
      setCoverImage(null);
      setPdfFile(null);
    } catch (error) {
      console.error(error);
      setMessage({ text: "Failed to upload book. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">📚 Admin - Upload a New Book</h1>

      {message && (
        <p
          className={`mt-2 p-3 rounded text-white ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {/* Book Title */}
        <div>
          <label className="block text-gray-700 font-medium">Book Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter book title"
            value={bookData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-gray-700 font-medium">Author</label>
          <input
            type="text"
            name="author"
            placeholder="Enter author's name"
            value={bookData.author}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            name="description"
            placeholder="Enter book description"
            value={bookData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        {/* Content */}
        <div>
          <label className="block text-gray-700 font-medium">Content</label>
          <textarea
            name="content"
            placeholder="Enter book content"
            value={bookData.content}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium">Cover Image</label>
          <input
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {coverImage && (
            <div className="mt-2">
              <Image
                src={URL.createObjectURL(coverImage)}
                alt="Cover Preview"
                width={200}
                height={200}
                className="w-24 h-24 object-cover rounded-md border"
              />
            </div>
          )}
        </div>

        {/* PDF File Upload */}
        <div>
          <label className="block text-gray-700 font-medium">Book PDF</label>
          <input
            type="file"
            name="pdfFile"
            accept="application/pdf"
            onChange={handleFileChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 text-white font-bold rounded-md ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          } transition`}
        >
          {loading ? "Uploading..." : "Upload Book"}
        </button>
      </form>
    </div>
  );
}
