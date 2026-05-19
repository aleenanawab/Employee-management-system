"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  function logout() {
    signOut({ callbackUrl: "/login" });
  }

  function requireAuth() {
    if (status === "unauthenticated") router.push("/login");
  }

  return { session, status, logout, requireAuth, isLoading: status === "loading" };
}
