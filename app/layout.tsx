import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./components/Navbar";
import connectDB from "./lib/mongoose";
import Sidebar from "./components/Sidebar";
import MobileNavbar from "./components/MobileNavbar";



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
      <html lang="en" data-theme="light">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
        >
          {/* Navbar */}
          <Navbar />

          {/* Main Content Container */}
          <div className="flex min-h-screen">
            {/* Sidebar (Hidden on Mobile) */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 transition-all duration-300 ml-[6px] lg:ml-[256px] md:ml-[256px] p-4">
              {children}
            </main>
          </div>



          {/* Mobile Navbar (Visible Only on Mobile) */}
          <MobileNavbar />
        </body>
      </html>
    </ClerkProvider>
  
  );
}