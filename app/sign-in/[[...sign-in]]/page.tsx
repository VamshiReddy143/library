// pages/auth/signin.tsx
import { SignIn } from "@clerk/nextjs";
import React from "react";

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Welcome Back 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
          Sign in to continue accessing your account.
        </p>
        <SignIn/>
      </div>
    </div>
  );
};

export default SignInPage;
