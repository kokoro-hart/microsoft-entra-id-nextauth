import type { PropsWithChildren } from "react";
import { AuthGuardProvider } from "@/providers/AuthGuardProvider";

export default function ProtectedLayout({ children }: PropsWithChildren) {
  return <AuthGuardProvider>{children}</AuthGuardProvider>;
}
