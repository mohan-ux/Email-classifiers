"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AuthButton from "@/components/AuthButton";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to dashboard when authenticated
  useEffect(() => {
    console.log("Auth status:", status, "Session:", session);
    if (status === "authenticated" && session) {
      console.log("Redirecting to dashboard...");
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-4xl space-y-8 text-center">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl">
            Email Classifier App
          </h1>
          <p className="text-xl text-gray-600 sm:text-2xl">
            Organize your Gmail inbox with AI-powered classification
          </p>
        </div>

        {/* Features Section */}
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-3 text-4xl">🔐</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Secure Authentication
            </h3>
            <p className="text-sm text-gray-600">
              Sign in securely with your Google account
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-3 text-4xl">🤖</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              AI-Powered Classification
            </h3>
            <p className="text-sm text-gray-600">
              Automatically categorize emails using GPT-4o
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-3 text-4xl">📊</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Smart Organization
            </h3>
            <p className="text-sm text-gray-600">
              Group emails by category for easy management
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="space-y-4 pt-4">
          <AuthButton />
          <p className="text-sm text-gray-500">
            Get started by signing in with your Google account
          </p>
        </div>

        {/* Additional Info */}
        <div className="mx-auto max-w-2xl rounded-lg bg-white/50 p-6 backdrop-blur-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            How it works
          </h2>
          <ol className="space-y-2 text-left text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">1.</span>
              <span>Sign in with your Google account to access Gmail</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">2.</span>
              <span>Provide your OpenAI API key for classification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">3.</span>
              <span>Fetch your recent emails and let AI categorize them</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">4.</span>
              <span>
                View organized emails by category: Important, Promotional,
                Social, Marketing, Spam, and General
              </span>
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}
