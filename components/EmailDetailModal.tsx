"use client";

import { ClassifiedEmail, EmailCategory } from "@/types/email";

interface EmailDetailModalProps {
  email: ClassifiedEmail | null;
  isOpen: boolean;
  onClose: () => void;
}

const categoryColors: Record<EmailCategory, string> = {
  Important: "bg-red-100 text-red-800 border-red-200",
  Promotional: "bg-purple-100 text-purple-800 border-purple-200",
  Social: "bg-blue-100 text-blue-800 border-blue-200",
  Marketing: "bg-green-100 text-green-800 border-green-200",
  Spam: "bg-gray-100 text-gray-800 border-gray-200",
  General: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch (error) {
    return dateString;
  }
}

export default function EmailDetailModal({
  email,
  isOpen,
  onClose,
}: EmailDetailModalProps) {
  if (!isOpen || !email) return null;

  const categoryColorClass = categoryColors[email.category] || categoryColors.General;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Email Details</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          {/* Category Badge */}
          <div className="mb-4">
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${categoryColorClass}`}>
              {email.category}
            </span>
          </div>

          {/* Subject */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {email.subject || "(No Subject)"}
          </h3>

          {/* From */}
          <div className="mb-2">
            <span className="text-sm font-medium text-gray-600">From: </span>
            <span className="text-sm text-gray-900">{email.sender}</span>
          </div>

          {/* Date */}
          <div className="mb-6">
            <span className="text-sm font-medium text-gray-600">Date: </span>
            <span className="text-sm text-gray-900">{formatDate(email.date)}</span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* Email Body/Snippet */}
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{email.snippet}</p>
            {email.body && (
              <div className="mt-4">
                <p className="text-gray-700 whitespace-pre-wrap">{email.body}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
