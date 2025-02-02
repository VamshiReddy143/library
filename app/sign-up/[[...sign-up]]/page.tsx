import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-4">
          Create Your Account
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
          Join us and explore an amazing library experience.
        </p>
        <div className="w-full">
          <SignUp appearance={{
            elements: {
              formButtonPrimary: "bg-blue-500 hover:bg-blue-600 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition",
              formFieldInput: "border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 dark:focus:ring-purple-400 transition-all",
              formFieldLabel: "text-gray-800 dark:text-gray-200 font-medium",
            }
          }} />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
