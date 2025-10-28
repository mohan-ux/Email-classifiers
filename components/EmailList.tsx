"use client";

import { ClassifiedEmail, EmailCategory } from "@/types/email";
import CategorySection from "./CategorySection";

interface EmailListProps {
  emails: ClassifiedEmail[];
  onEmailClick?: (email: ClassifiedEmail) => void;
}

/**
 * All possible email categories in display order
 */
const CATEGORIES: EmailCategory[] = [
  "Important",
  "Promotional",
  "Social",
  "Marketing",
  "Spam",
  "General",
];

/**
 * EmailList component groups emails by category and displays them in sections
 * Handles empty state when no emails are present
 */
export default function EmailList({ emails, onEmailClick }: EmailListProps) {
  // Group emails by category
  const emailsByCategory = emails.reduce((acc, email) => {
    const category = email.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(email);
    return acc;
  }, {} as Record<EmailCategory, ClassifiedEmail[]>);

  // Calculate count for each category
  const categoryCounts = CATEGORIES.map((category) => ({
    category,
    count: emailsByCategory[category]?.length || 0,
    emails: emailsByCategory[category] || [],
  }));

  // Handle empty state
  if (emails.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <div className="mx-auto max-w-md">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No emails to display
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Click the &quot;Fetch Emails&quot; button above to load your recent emails
            and classify them automatically.
          </p>
        </div>
      </div>
    );
  }

  // Render CategorySection for each category that has emails
  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm font-medium text-blue-900">
            Showing {emails.length} classified {emails.length === 1 ? "email" : "emails"}
          </p>
        </div>
      </div>

      {/* Category Sections */}
      {categoryCounts
        .filter((item) => item.count > 0)
        .map((item) => (
          <CategorySection
            key={item.category}
            category={item.category}
            emails={item.emails}
            count={item.count}
            onEmailClick={onEmailClick}
          />
        ))}
    </div>
  );
}
