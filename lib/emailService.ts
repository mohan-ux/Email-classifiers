import { Email, ClassifiedEmail, FetchEmailsResponse, ClassifyEmailsResponse } from '@/types/email';
import { saveClassifiedEmails, saveLastFetchTime } from './storage';

/**
 * Error types for email service operations
 */
export class EmailServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'EmailServiceError';
  }
}

/**
 * Fetch emails from the Gmail API via the backend route
 * @param openaiKey - User's OpenAI API key for classification
 * @returns Promise resolving to array of Email objects
 * @throws EmailServiceError if the fetch operation fails
 */
export async function fetchEmails(openaiKey: string): Promise<Email[]> {
  try {
    const response = await fetch('/api/emails/fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ openaiApiKey: openaiKey }),
    });

    const data: FetchEmailsResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new EmailServiceError(
        data.error || 'Failed to fetch emails',
        'FETCH_ERROR',
        response.status
      );
    }

    return data.emails;
  } catch (error) {
    if (error instanceof EmailServiceError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new EmailServiceError(
        'Network error. Please check your connection.',
        'NETWORK_ERROR'
      );
    }

    throw new EmailServiceError(
      'An unexpected error occurred while fetching emails',
      'UNKNOWN_ERROR'
    );
  }
}

/**
 * Classify emails using OpenAI via the backend route
 * @param emails - Array of Email objects to classify
 * @param openaiKey - User's OpenAI API key
 * @returns Promise resolving to array of ClassifiedEmail objects
 * @throws EmailServiceError if the classification operation fails
 */
export async function classifyEmails(
  emails: Email[],
  openaiKey: string
): Promise<ClassifiedEmail[]> {
  try {
    const response = await fetch('/api/emails/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emails,
        openaiKey,
      }),
    });

    const data: ClassifyEmailsResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new EmailServiceError(
        data.error || 'Failed to classify emails',
        'CLASSIFY_ERROR',
        response.status
      );
    }

    return data.classifiedEmails;
  } catch (error) {
    if (error instanceof EmailServiceError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new EmailServiceError(
        'Network error. Please check your connection.',
        'NETWORK_ERROR'
      );
    }

    throw new EmailServiceError(
      'An unexpected error occurred while classifying emails',
      'UNKNOWN_ERROR'
    );
  }
}

/**
 * Result of the email fetching and classification operation
 */
export interface FetchAndClassifyResult {
  /** Array of classified emails */
  classifiedEmails: ClassifiedEmail[];
  /** Whether the operation was successful */
  success: boolean;
  /** Error message if the operation failed */
  error?: string;
}

/**
 * Orchestration function to fetch, classify, and store emails
 * This function handles the complete workflow:
 * 1. Fetch emails from Gmail
 * 2. Classify emails using OpenAI
 * 3. Store classified emails in localStorage
 * 4. Store timestamp of the operation
 * 
 * @param openaiKey - User's OpenAI API key
 * @returns Promise resolving to FetchAndClassifyResult
 */
export async function fetchAndClassifyEmails(
  openaiKey: string
): Promise<FetchAndClassifyResult> {
  try {
    // Step 1: Fetch emails from Gmail
    const emails = await fetchEmails(openaiKey);

    if (emails.length === 0) {
      return {
        classifiedEmails: [],
        success: true,
        error: undefined,
      };
    }

    // Step 2: Classify emails using OpenAI
    const classifiedEmails = await classifyEmails(emails, openaiKey);

    // Step 3: Store classified emails in localStorage
    const emailsSaved = saveClassifiedEmails(classifiedEmails);
    if (!emailsSaved) {
      console.warn('Failed to save emails to localStorage');
    }

    // Step 4: Store timestamp of the operation
    const timestampSaved = saveLastFetchTime(new Date());
    if (!timestampSaved) {
      console.warn('Failed to save timestamp to localStorage');
    }

    return {
      classifiedEmails,
      success: true,
      error: undefined,
    };
  } catch (error) {
    if (error instanceof EmailServiceError) {
      return {
        classifiedEmails: [],
        success: false,
        error: error.message,
      };
    }

    return {
      classifiedEmails: [],
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
