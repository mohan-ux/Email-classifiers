"use client";

import { ClassifiedEmail, EmailCategory } from "@/types/email";

interface EmailCardProps {
  email: ClassifiedEmail;
  onClick?: () => void;
}

/**
 * Category color mapping for badges
 */
const categoryColors: Record<EmailCategory, string> = {
  Important: "bg-red-100 text-red-800 border-red-200",
  Promotional: "bg-purple-100 text-purple-800 border-purple-200",
  Social: "bg-blue-100 text-blue-800 border-blue-200",
  Marketing: "bg-green-100 text-green-800 border-green-200",
  Spam: "bg-gray-100 text-gray-800 border-gray-200",
  General: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

/**
 * Format date to a readable string
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    // If less than 24 hours ago, show relative time
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
      }
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    // Otherwise show formatted date
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch (error) {
    return dateString;
  }
}

/**
 * EmailCard component displays individual email information
 * with sender, subject, snippet, date, and category badge
 */
export default function EmailCard({ email, onClick }: EmailCardProps) {
  const categoryColorClass = categoryColors[email.category] || categoryColors.General;

  return (
    <div 
      onClick={onClick}
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-blue-300 cursor-pointer"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* Email Content */}
        <div className="flex-1 min-w-0">
          {/* Subject */}
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {email.subject || "(No Subject)"}
          </h3>

          {/* Sender */}
          <p className="mt-1 text-sm text-gray-600 truncate">
            <span className="font-medium">From:</span> {email.sender}
          </p>

          {/* Snippet */}
          <p className="mt-2 text-sm text-gray-700 line-clamp-2">
            {email.snippet}
          </p>

          {/* Date */}
          <p className="mt-2 text-xs text-gray-500">
            {formatDate(email.date)}
          </p>
        </div>

        {/* Category Badge */}
        <div className="flex-shrink-0">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${categoryColorClass}`}
          >
            {email.category}
          </span>
        </div>
      </div>
    </div>
  );
}
