/**
 * Email category types for classification
 */
export type EmailCategory = 
  | 'Important'
  | 'Promotional'
  | 'Social'
  | 'Marketing'
  | 'Spam'
  | 'General';

/**
 * Base email interface representing an email message
 */
export interface Email {
  /** Unique identifier for the email */
  id: string;
  /** Email address of the sender */
  sender: string;
  /** Subject line of the email */
  subject: string;
  /** Short preview text of the email content */
  snippet: string;
  /** ISO timestamp of when the email was sent */
  date: string;
  /** Optional full body content of the email */
  body?: string;
}

/**
 * Classified email interface extending Email with category information
 */
export interface ClassifiedEmail extends Email {
  /** The assigned category for this email */
  category: EmailCategory;
}

/**
 * Response type for fetching emails from Gmail API
 */
export interface FetchEmailsResponse {
  /** Array of fetched email objects */
  emails: Email[];
  /** Indicates if the fetch operation was successful */
  success: boolean;
  /** Optional error message if the operation failed */
  error?: string;
}

/**
 * Request type for classifying emails with OpenAI
 */
export interface ClassifyEmailsRequest {
  /** Array of emails to be classified */
  emails: Email[];
  /** User's OpenAI API key for authentication */
  openaiKey: string;
}

/**
 * Response type for email classification operation
 */
export interface ClassifyEmailsResponse {
  /** Array of emails with assigned categories */
  classifiedEmails: ClassifiedEmail[];
  /** Indicates if the classification operation was successful */
  success: boolean;
  /** Optional error message if the operation failed */
  error?: string;
}
