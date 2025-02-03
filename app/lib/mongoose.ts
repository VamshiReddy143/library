import mongoose from "mongoose";

let isConnected = false; // Track if MongoDB is already connected

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    if (isConnected) {
      console.log("Using existing MongoDB connection");
      return;
    }

    // Connect to MongoDB with proper options
    await mongoose.connect(MONGODB_URI, {
      dbName: "library", // Ensure correct DB name
    });

    isConnected = true; // Mark connection as established
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Database connection failed");
  }
};

export default connectDB;
