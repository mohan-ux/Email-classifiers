"use client";

import { useState } from "react";
import { ClassifiedEmail, EmailCategory } from "@/types/email";
import EmailCard from "./EmailCard";

interface CategorySectionProps {
  category: EmailCategory;
  emails: ClassifiedEmail[];
  count: number;
  onEmailClick?: (email: ClassifiedEmail) => void;
}

/**
 * Category icons mapping
 */
const categoryIcons: Record<EmailCategory, string> = {
  Important: "⭐",
  Promotional: "🎁",
  Social: "👥",
  Marketing: "📢",
  Spam: "🚫",
  General: "📧",
};

/**
 * Category color themes for section headers
 */
const categoryThemes: Record<EmailCategory, string> = {
  Important: "bg-red-50 border-red-200 text-red-900",
  Promotional: "bg-purple-50 border-purple-200 text-purple-900",
  Social: "bg-blue-50 border-blue-200 text-blue-900",
  Marketing: "bg-green-50 border-green-200 text-green-900",
  Spam: "bg-gray-50 border-gray-200 text-gray-900",
  General: "bg-yellow-50 border-yellow-200 text-yellow-900",
};

/**
 * CategorySection component displays a collapsible section for a specific email category
 * Shows category icon, name, count, and list of emails
 */
export default function CategorySection({
  category,
  emails,
  count,
  onEmailClick,
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const themeClass = categoryThemes[category] || categoryThemes.General;
  const icon = categoryIcons[category] || categoryIcons.General;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Category Header */}
      <button
        onClick={toggleExpanded}
        className={`w-full flex items-center justify-between p-4 transition-colors hover:opacity-90 ${themeClass} border-b`}
        aria-expanded={isExpanded}
        aria-controls={`category-${category}`}
      >
        <div className="flex items-center gap-3">
          {/* Category Icon */}
          <span className="text-2xl" aria-hidden="true">
            {icon}
          </span>

          {/* Category Name and Count */}
          <div className="text-left">
            <h2 className="text-lg font-semibold">{category}</h2>
            <p className="text-sm opacity-75">
              {count} {count === 1 ? "email" : "emails"}
            </p>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <svg
          className={`h-6 w-6 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Email List */}
      {isExpanded && (
        <div
          id={`category-${category}`}
          className="p-4 space-y-3 bg-gray-50"
        >
          {emails.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No emails in this category
            </p>
          ) : (
            emails.map((email) => (
              <EmailCard 
                key={email.id} 
                email={email} 
                onClick={() => onEmailClick?.(email)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
