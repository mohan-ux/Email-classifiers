"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getOpenAIKey,
  getGeminiKey,
  getAIProvider,
  getClassifiedEmails,
  saveClassifiedEmails,
  saveLastFetchTime,
  getLastFetchTime,
  clearAllData,
} from "@/lib/storage";
import { ClassifiedEmail } from "@/types/email";
import ApiKeyModal from "@/components/ApiKeyModal";
import AuthButton from "@/components/AuthButton";
import EmailList from "@/components/EmailList";
import EmailDetailPanel from "@/components/EmailDetailPanel";
import EmailDetailModal from "@/components/EmailDetailModal";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [isCheckingKey, setIsCheckingKey] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [emails, setEmails] = useState<ClassifiedEmail[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<ClassifiedEmail | null>(null);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Check for API key and load emails on mount
  useEffect(() => {
    if (status === "authenticated") {
      checkApiKey();
      loadEmailsFromStorage();
    }
  }, [status]);

  /**
   * Check if at least one API key exists in localStorage
   */
  const checkApiKey = () => {
    setIsCheckingKey(true);
    const openaiKey = getOpenAIKey();
    const geminiKey = getGeminiKey();
    
    if (openaiKey || geminiKey) {
      setHasApiKey(true);
      setShowApiKeyModal(false);
    } else {
      setHasApiKey(false);
      setShowApiKeyModal(true);
    }
    
    setIsCheckingKey(false);
  };

  /**
   * Load classified emails from localStorage on mount
   */
  const loadEmailsFromStorage = () => {
    const storedEmails = getClassifiedEmails();
    const storedTime = getLastFetchTime();
    
    if (storedEmails && storedEmails.length > 0) {
      setEmails(storedEmails);
    }
    
    if (storedTime) {
      setLastFetchTime(storedTime);
    }
  };

  /**
   * Handle when API key is saved
   */
  const handleApiKeySaved = () => {
    setHasApiKey(true);
    setShowApiKeyModal(false);
  };

  /**
   * Handle modal close
   */
  const handleModalClose = () => {
    // Only allow closing if key exists
    const apiKey = getOpenAIKey();
    if (apiKey) {
      setShowApiKeyModal(false);
    }
  };

  /**
   * Fetch and classify emails
   */
  const handleFetchEmails = async () => {
    setIsFetching(true);
    setError(null);

    try {
      // Get provider and appropriate API key
      const provider = getAIProvider();
      const openaiKey = getOpenAIKey();
      const geminiKey = getGeminiKey();
      
      const apiKey = provider === "openai" ? openaiKey : geminiKey;
      
      if (!apiKey) {
        throw new Error(`${provider === "openai" ? "OpenAI" : "Gemini"} API key not found`);
      }

      // Step 1: Fetch emails from Gmail API
      const fetchResponse = await fetch("/api/emails/fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ openaiApiKey: apiKey }),
      });

      if (!fetchResponse.ok) {
        const errorData = await fetchResponse.json();
        throw new Error(errorData.error || "Failed to fetch emails");
      }

      const fetchData = await fetchResponse.json();
      const fetchedEmails = fetchData.emails || [];
      
      if (fetchedEmails.length === 0) {
        setEmails([]);
        setError("No emails found in your inbox");
        return;
      }

      // Step 2: Classify the fetched emails using selected AI provider
      console.log('Sending classification request:', {
        emailCount: fetchedEmails.length,
        provider: provider,
        hasOpenAIKey: !!(provider === "openai" ? apiKey : undefined),
        hasGeminiKey: !!(provider === "gemini" ? apiKey : undefined)
      });
      
      const classifyResponse = await fetch("/api/emails/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          emails: fetchedEmails,
          openaiKey: provider === "openai" ? apiKey : undefined,
          geminiKey: provider === "gemini" ? apiKey : undefined,
          provider: provider
        }),
      });

      console.log('Classification response status:', classifyResponse.status);

      if (!classifyResponse.ok) {
        const errorData = await classifyResponse.json();
        console.error('Classification error response:', errorData);
        throw new Error(errorData.error || "Failed to classify emails");
      }

      const classifyData = await classifyResponse.json();
      const classifiedEmails = classifyData.classifiedEmails || [];
      
      // Update state with classified emails
      setEmails(classifiedEmails);
      
      // Save to localStorage
      const currentTime = new Date().toISOString();
      saveClassifiedEmails(classifiedEmails);
      saveLastFetchTime(currentTime);
      setLastFetchTime(currentTime);
      
      console.log(`Successfully fetched and classified ${classifiedEmails.length} emails using ${provider}`);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching emails");
      console.error("Fetch emails error:", err);
    } finally {
      setIsFetching(false);
    }
  };

  /**
   * Clear all email data from state and localStorage
   */
  const handleClearData = () => {
    // Clear state
    setEmails([]);
    setError(null);
    setLastFetchTime(null);
    
    // Clear localStorage (but keep API keys and provider)
    const openaiKey = getOpenAIKey();
    const geminiKey = getGeminiKey();
    const provider = getAIProvider();
    clearAllData();
    
    // Restore API keys and provider after clearing
    if (openaiKey || geminiKey) {
      import("@/lib/storage").then(({ saveOpenAIKey, saveGeminiKey, saveAIProvider }) => {
        if (openaiKey) saveOpenAIKey(openaiKey);
        if (geminiKey) saveGeminiKey(geminiKey);
        saveAIProvider(provider);
      });
    }
  };

  /**
   * Handle email click to show detail panel
   */
  const handleEmailClick = (email: ClassifiedEmail) => {
    setSelectedEmail(email);
  };

  /**
   * Handle closing email detail panel
   */
  const handleCloseEmailDetail = () => {
    setSelectedEmail(null);
  };

  // Show loading state while checking authentication
  if (status === "loading" || isCheckingKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (status !== "authenticated" || !session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Email Classifier Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Manage and classify your Gmail emails
              </p>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* API Key Status */}
        <div className="mb-6">
          {hasApiKey ? (
            <div className="rounded-lg bg-green-50 p-4 border border-green-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {getAIProvider() === "openai" ? "OpenAI" : "Gemini"} API key configured
                  </p>
                  <p className="mt-1 text-xs text-green-700">
                    You can now fetch and classify emails using {getAIProvider() === "openai" ? "GPT-4o" : "Gemini 2.0 Flash"}
                  </p>
                </div>
                <div className="ml-auto">
                  <button
                    onClick={() => setShowApiKeyModal(true)}
                    className="text-sm font-medium text-green-800 hover:text-green-900 underline"
                  >
                    Update Key
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-800">
                    OpenAI API key required
                  </p>
                  <p className="mt-1 text-xs text-yellow-700">
                    Please provide your API key to enable email classification
                  </p>
                </div>
                <div className="ml-auto">
                  <button
                    onClick={() => setShowApiKeyModal(true)}
                    className="rounded-md bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 hover:bg-yellow-200"
                  >
                    Add Key
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Email Actions */}
        <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Email Management
            </h2>
            {lastFetchTime && (
              <p className="text-xs text-gray-500">
                Last fetched: {new Date(lastFetchTime).toLocaleString()}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleFetchEmails}
              disabled={!hasApiKey || isFetching}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              title={!hasApiKey ? "Please add your OpenAI API key first" : ""}
            >
              {isFetching && (
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {isFetching ? "Fetching & Classifying..." : "Fetch Emails"}
            </button>
            
            <button
              onClick={handleClearData}
              disabled={emails.length === 0}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear Data
            </button>
          </div>

          {!hasApiKey && (
            <p className="mt-3 text-sm text-gray-500">
              Email fetching is disabled until you provide an OpenAI API key
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isFetching && (
          <div className="mt-6 rounded-lg bg-blue-50 p-8 border border-blue-200">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
              <p className="text-sm font-medium text-blue-900">
                Fetching and classifying your emails...
              </p>
              <p className="text-xs text-blue-700">
                This may take a few moments
              </p>
            </div>
          </div>
        )}

        {/* Email List */}
        {!isFetching && (
          <div className="mt-6">
            <EmailList emails={emails} onEmailClick={handleEmailClick} />
          </div>
        )}
      </main>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={handleModalClose}
        onKeySaved={handleApiKeySaved}
      />

      {/* Email Detail Panel */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 flex bg-black bg-opacity-50">
          <div className="ml-auto w-full max-w-2xl">
            <EmailDetailPanel
              email={selectedEmail}
              onClose={handleCloseEmailDetail}
            />
          </div>
        </div>
      )}
    </div>
  );
}
