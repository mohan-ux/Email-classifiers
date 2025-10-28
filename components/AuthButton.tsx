"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state during authentication
  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  // Authenticated state - show user profile and sign out button
  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {session.user.image && (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="h-10 w-10 rounded-full border-2 border-gray-200"
            />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {session.user.name}
            </span>
            <span className="text-xs text-gray-500">{session.user.email}</span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // Unauthenticated state - show sign in button
  return (
    <button
      onClick={handleSignIn}
      className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Sign in with Google
    </button>
  );
}
