import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./components/Navbar";
import connectDB from "./lib/mongoose";
import Sidebar from "./components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Library App",
  description: "A modern library management app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  connectDB();
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar />
          <div className="flex">
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 ml-[16rem] lg:ml-[20rem] transition-all duration-300">
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}