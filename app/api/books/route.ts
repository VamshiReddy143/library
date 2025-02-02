import cloudinary from "@/app/components/cloudinary/cloudinary";
import connectDB from "@/app/lib/mongoose";
import BookModel from "@/app/models/Book.model";
import { NextResponse } from "next/server";
import { Readable } from "stream";

export const config = {
    api: {
        bodyParser: false, // Disable default body parser
    },
};

async function uploadToCloudinary(fileBuffer: Buffer, folder: string, resourceType: "image" | "raw") {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: resourceType,
                public_id: `${Date.now()}`, // Ensures unique filename
                format: resourceType === "raw" ? "pdf" : undefined // Ensures correct PDF format
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    reject(error);
                } else {
                    console.log("Cloudinary Upload Success:", result);
                    resolve(result?.secure_url); // Ensure only secure URL is returned
                }
            }
        );

        const readableStream = new Readable();
        readableStream.push(fileBuffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
    });
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const formData = await request.formData();
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const author = formData.get("author") as string;
        const description = formData.get("description") as string;
        const coverImage = formData.get("coverImage") as File;
        const pdfFile = formData.get("pdfFile") as File;
        const available = formData.get("available") === "true";

        if (!title || !author || !description || !coverImage || !pdfFile || !content) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const coverBuffer = Buffer.from(await coverImage.arrayBuffer());
        const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());

        const coverUpload = await uploadToCloudinary(coverBuffer, "books/covers", "image");
        const pdfUpload = await uploadToCloudinary(pdfBuffer, "books/pdfs", "raw");

        if (!coverUpload || !pdfUpload) {
            return NextResponse.json({ message: "Cloudinary upload failed" }, { status: 500 });
        }

        const newBook = await BookModel.create({
            title,
            author,
            description,
            content,
            coverImage: coverUpload,
            pdfUrl: pdfUpload,
            available
        });

        return NextResponse.json({ message: "Book created successfully", book: newBook }, { status: 201 });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        await connectDB();
        const books = await BookModel.find();
        return NextResponse.json({ books }, { status: 200 });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
