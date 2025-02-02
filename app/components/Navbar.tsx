"use client";

import { SignedIn, SignedOut, UserButton, SignInButton, useUser } from "@clerk/nextjs";



export default function Navbar() {
  // Use the `useUser` hook to get the current user's details
  const { user } = useUser();

  return (
    <nav className="w-[100%] p-4 dark:bg-gray-900 bg-gray-800 flex justify-between items-center">
      {/* App Logo */}
      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
        📚 Library
      </h1>

      {/* Authentication Section */}
      <div className="flex items-center gap-4 z-[999] cursor-pointer">
        <SignedIn>
          {/* Display User Name */}
          {user && (
            <div className="flex flex-col text-right text-gray-200">
              <span className="font-semibold">{user.firstName} {user.lastName}</span>
  
            </div>
          )}
          {/* User Button */}
          <UserButton />
       
         

         
        </SignedIn>
        <SignedOut>
          {/* Sign-In Button */}
          <SignInButton>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
}