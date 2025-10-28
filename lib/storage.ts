import { ClassifiedEmail } from '@/types/email';

/**
 * Storage keys used throughout the application
 */
export const STORAGE_KEYS = {
  OPENAI_API_KEY: 'openai_api_key',
  GEMINI_API_KEY: 'gemini_api_key',
  AI_PROVIDER: 'ai_provider',
  CLASSIFIED_EMAILS: 'classified_emails',
  LAST_FETCH_TIME: 'last_fetch_time',
} as const;

/**
 * AI Provider types
 */
export type AIProvider = 'openai' | 'gemini';

/**
 * Generic function to save data to localStorage with error handling
 * @param key - The storage key
 * @param value - The value to store (will be JSON stringified)
 * @returns true if successful, false otherwise
 */
export function saveToLocalStorage<T>(key: string, value: T): boolean {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    if (error instanceof DOMException) {
      if (error.name === 'QuotaExceededError') {
        console.error('LocalStorage quota exceeded. Please clear some data.');
        // Optionally, you could clear old data here
        return false;
      } else if (error.name === 'SecurityError') {
        console.error('LocalStorage access denied. Check browser settings.');
        return false;
      }
    }
    console.error('Failed to save to localStorage:', error);
    return false;
  }
}

/**
 * Generic function to retrieve data from localStorage with error handling
 * @param key - The storage key
 * @returns The parsed value or null if not found or error occurred
 */
export function getFromLocalStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'SecurityError') {
      console.error('LocalStorage access denied. Check browser settings.');
    } else {
      console.error('Failed to retrieve from localStorage:', error);
    }
    return null;
  }
}

/**
 * Save OpenAI API key to localStorage
 * @param apiKey - The OpenAI API key to store
 * @returns true if successful, false otherwise
 */
export function saveOpenAIKey(apiKey: string): boolean {
  return saveToLocalStorage(STORAGE_KEYS.OPENAI_API_KEY, apiKey);
}

/**
 * Retrieve OpenAI API key from localStorage
 * @returns The API key or null if not found
 */
export function getOpenAIKey(): string | null {
  return getFromLocalStorage<string>(STORAGE_KEYS.OPENAI_API_KEY);
}

/**
 * Remove OpenAI API key from localStorage
 */
export function removeOpenAIKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.OPENAI_API_KEY);
  } catch (error) {
    console.error('Failed to remove OpenAI key:', error);
  }
}

/**
 * Save Gemini API key to localStorage
 * @param apiKey - The Gemini API key to store
 * @returns true if successful, false otherwise
 */
export function saveGeminiKey(apiKey: string): boolean {
  return saveToLocalStorage(STORAGE_KEYS.GEMINI_API_KEY, apiKey);
}

/**
 * Retrieve Gemini API key from localStorage
 * @returns The API key or null if not found
 */
export function getGeminiKey(): string | null {
  return getFromLocalStorage<string>(STORAGE_KEYS.GEMINI_API_KEY);
}

/**
 * Remove Gemini API key from localStorage
 */
export function removeGeminiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
  } catch (error) {
    console.error('Failed to remove Gemini key:', error);
  }
}

/**
 * Save AI provider preference to localStorage
 * @param provider - The AI provider ('openai' or 'gemini')
 * @returns true if successful, false otherwise
 */
export function saveAIProvider(provider: AIProvider): boolean {
  return saveToLocalStorage(STORAGE_KEYS.AI_PROVIDER, provider);
}

/**
 * Retrieve AI provider preference from localStorage
 * @returns The provider or 'openai' as default
 */
export function getAIProvider(): AIProvider {
  return getFromLocalStorage<AIProvider>(STORAGE_KEYS.AI_PROVIDER) || 'openai';
}

/**
 * Save classified emails to localStorage
 * @param emails - Array of classified emails to store
 * @returns true if successful, false otherwise
 */
export function saveClassifiedEmails(emails: ClassifiedEmail[]): boolean {
  return saveToLocalStorage(STORAGE_KEYS.CLASSIFIED_EMAILS, emails);
}

/**
 * Retrieve classified emails from localStorage
 * @returns Array of classified emails or null if not found
 */
export function getClassifiedEmails(): ClassifiedEmail[] | null {
  return getFromLocalStorage<ClassifiedEmail[]>(STORAGE_KEYS.CLASSIFIED_EMAILS);
}

/**
 * Remove classified emails from localStorage
 */
export function removeClassifiedEmails(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CLASSIFIED_EMAILS);
  } catch (error) {
    console.error('Failed to remove classified emails:', error);
  }
}

/**
 * Save the timestamp of the last email fetch
 * @param timestamp - ISO timestamp string or Date object
 * @returns true if successful, false otherwise
 */
export function saveLastFetchTime(timestamp: string | Date): boolean {
  const isoTimestamp = timestamp instanceof Date ? timestamp.toISOString() : timestamp;
  return saveToLocalStorage(STORAGE_KEYS.LAST_FETCH_TIME, isoTimestamp);
}

/**
 * Retrieve the timestamp of the last email fetch
 * @returns ISO timestamp string or null if not found
 */
export function getLastFetchTime(): string | null {
  return getFromLocalStorage<string>(STORAGE_KEYS.LAST_FETCH_TIME);
}

/**
 * Remove the last fetch timestamp from localStorage
 */
export function removeLastFetchTime(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.LAST_FETCH_TIME);
  } catch (error) {
    console.error('Failed to remove last fetch time:', error);
  }
}

/**
 * Clear all application data from localStorage
 * This includes API keys, emails, and timestamps
 */
export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.OPENAI_API_KEY);
    localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
    localStorage.removeItem(STORAGE_KEYS.AI_PROVIDER);
    localStorage.removeItem(STORAGE_KEYS.CLASSIFIED_EMAILS);
    localStorage.removeItem(STORAGE_KEYS.LAST_FETCH_TIME);
  } catch (error) {
    console.error('Failed to clear all data:', error);
  }
}

/**
 * Check if localStorage is available and accessible
 * @returns true if localStorage is available, false otherwise
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}
