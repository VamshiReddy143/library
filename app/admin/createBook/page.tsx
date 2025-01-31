"use client";

import { useState } from "react";


export default function AdminPage() {
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    description: "",
    available: true,
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
      setMessage("Please select both an image and a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("title", bookData.title);
    formData.append("author", bookData.author);
    formData.append("description", bookData.description);
    formData.append("available", String(bookData.available));
    formData.append("coverImage", coverImage);
    formData.append("pdfFile", pdfFile);

    setLoading(true);
    setMessage("");

    try {
    const res=await fetch("/api/books",{
        method:"POST",
        body:formData
    })

      if(!res.ok) throw new Error(res.statusText)
      setMessage("Book uploaded successfully!");
      setBookData({ title: "", author: "", description: "", available: true });
      setCoverImage(null);
      setPdfFile(null);
    } catch (error:unknown) {
      console.error(error);
      setMessage("Failed to upload book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold">Admin - Upload a New Book</h1>
      {message && <p className="mt-2 p-2 bg-gray-100 border text-black ">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <input type="text" name="title" placeholder="Title" value={bookData.title} onChange={handleChange} required className="w-full p-2 border" />
        <input type="text" name="author" placeholder="Author" value={bookData.author} onChange={handleChange} required className="w-full p-2 border" />
        <textarea name="description" placeholder="Description" value={bookData.description} onChange={handleChange} required className="w-full p-2 border"></textarea>
        <input type="file" name="coverImage" onChange={handleFileChange} required className="w-full p-2 border" />
        <input type="file" name="pdfFile" onChange={handleFileChange} required className="w-full p-2 border" />
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white">{loading ? "Uploading..." : "Upload Book"}</button>
      </form>
    </div>
  );
}
