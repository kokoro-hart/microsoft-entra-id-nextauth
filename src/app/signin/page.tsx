"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  const handleSignIn = () => {
    signIn(
      "microsoft-entra-id",
      {
        redirect: true,
      },
      {
        prompt: "select_account",
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        type="button"
        className="bg-white text-black p-2 rounded cursor-pointer flex items-center gap-2 border border-gray-300"
        onClick={handleSignIn}
      >
        <img src="/microsoft.svg" alt="Microsoft" className="w-6 h-6" />
        <span>Sign in with Microsoft</span>
      </button>
    </div>
  );
}
