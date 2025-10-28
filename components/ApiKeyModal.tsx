"use client";

import { useState, useEffect } from "react";
import { 
  saveOpenAIKey, 
  saveGeminiKey, 
  saveAIProvider,
  getOpenAIKey, 
  getGeminiKey,
  getAIProvider,
  type AIProvider 
} from "@/lib/storage";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
}

export default function ApiKeyModal({
  isOpen,
  onClose,
  onKeySaved,
}: ApiKeyModalProps) {
  const [provider, setProvider] = useState<AIProvider>("openai");
  const [openaiKey, setOpenaiKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const existingProvider = getAIProvider();
      const existingOpenAIKey = getOpenAIKey();
      const existingGeminiKey = getGeminiKey();
      
      setProvider(existingProvider);
      setOpenaiKey(existingOpenAIKey || "");
      setGeminiKey(existingGeminiKey || "");
      setError("");
    }
  }, [isOpen]);

  function validateOpenAIKey(key: string) {
    if (!key || key.trim().length === 0) {
      setError("OpenAI API key is required");
      return false;
    }
    if (!key.startsWith("sk-")) {
      setError("Invalid OpenAI API key format. Keys start with 'sk-'");
      return false;
    }
    if (key.length < 20) {
      setError("OpenAI API key appears to be too short");
      return false;
    }
    return true;
  }

  function validateGeminiKey(key: string) {
    if (!key || key.trim().length === 0) {
      setError("Gemini API key is required");
      return false;
    }
    if (key.length < 20) {
      setError("Gemini API key appears to be too short");
      return false;
    }
    return true;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    let saved = false;

    if (provider === "openai") {
      const trimmedKey = openaiKey.trim();
      if (validateOpenAIKey(trimmedKey)) {
        saved = saveOpenAIKey(trimmedKey) && saveAIProvider("openai");
      }
    } else {
      const trimmedKey = geminiKey.trim();
      if (validateGeminiKey(trimmedKey)) {
        saved = saveGeminiKey(trimmedKey) && saveAIProvider("gemini");
      }
    }

    if (saved) {
      onKeySaved();
      onClose();
    } else if (!error) {
      setError("Failed to save API key. Please check your browser settings.");
    }

    setIsSubmitting(false);
  };

  const handleClose = () => {
    const existingOpenAIKey = getOpenAIKey();
    const existingGeminiKey = getGeminiKey();
    
    if (!existingOpenAIKey && !existingGeminiKey) {
      setError("You must provide at least one API key to continue");
      return;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            AI API Key Configuration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose your AI provider and enter your API key.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Provider
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProvider("openai")}
                className={`flex items-center justify-center gap-2 rounded-md border-2 px-4 py-3 text-sm font-medium ${
                  provider === "openai"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                OpenAI
              </button>
              <button
                type="button"
                onClick={() => setProvider("gemini")}
                className={`flex items-center justify-center gap-2 rounded-md border-2 px-4 py-3 text-sm font-medium ${
                  provider === "gemini"
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Gemini
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
              {provider === "openai" ? "OpenAI" : "Gemini"} API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={provider === "openai" ? openaiKey : geminiKey}
              onChange={(e) => {
                if (provider === "openai") {
                  setOpenaiKey(e.target.value);
                } else {
                  setGeminiKey(e.target.value);
                }
                setError("");
              }}
              placeholder={provider === "openai" ? "sk-..." : "AIza..."}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isSubmitting}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className={`rounded-md p-3 ${provider === "openai" ? "bg-blue-50" : "bg-purple-50"}`}>
            <p className={`text-xs ${provider === "openai" ? "text-blue-700" : "text-purple-700"}`}>
              Don&apos;t have an API key?{" "}
              <a
                href={provider === "openai" ? "https://platform.openai.com/api-keys" : "https://aistudio.google.com/app/apikey"}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline"
              >
                Get one from {provider === "openai" ? "OpenAI" : "Google AI Studio"}
              </a>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium text-white ${
                provider === "openai"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-purple-600 hover:bg-purple-700"
              } disabled:opacity-50`}
            >
              {isSubmitting ? "Saving..." : "Save API Key"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500">
            🔒 Your API key is stored securely in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
