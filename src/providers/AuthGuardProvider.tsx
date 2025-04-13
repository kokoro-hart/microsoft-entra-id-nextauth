"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AuthGuardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => router.replace("/signin"),
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}
