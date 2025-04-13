"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

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
        <Image src="/microsoft.svg" alt="Microsoft" className="w-6 h-6" width={24} height={24} />
        <span>Sign in with Microsoft</span>
      </button>
    </div>
  );
}
