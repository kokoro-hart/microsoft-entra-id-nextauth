"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AuthGuardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => router.replace("/signin"),
  });

  if (session?.error) {
    void router.replace("/signin");
    return <div>Loading...</div>;
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}
