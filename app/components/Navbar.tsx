"use client";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import SignInPage from "../sign-in/[[...sign-in]]/page";

export default function Navbar() {
  return (
    <nav className="w-full p-4 bg-gray-100 dark:bg-gray-900 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
        Library App 📚
      </h1>
      <div>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </nav>
  );
}
