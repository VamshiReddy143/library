import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-300 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-4">
          Create Your Account
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          Join us and explore an amazing library experience.
        </p>
        <div className="w-full">
          <SignUp />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
