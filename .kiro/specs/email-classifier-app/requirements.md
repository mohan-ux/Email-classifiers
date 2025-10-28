# Requirements Document

## Introduction

The Email Classifier Application is a web-based system that enables users to authenticate with their Google account, fetch emails from Gmail, and automatically classify them into organized categories using AI. The System provides an intuitive interface for viewing categorized emails with visual organization similar to modern email clients.

## Glossary

- **System**: The Email Classifier Application
- **User**: A person who authenticates and uses the application to classify their emails
- **Gmail_API**: Google's API service for accessing Gmail data
- **OpenAI_API**: OpenAI's API service for AI-powered email classification
- **Classification_Engine**: The AI-powered component that assigns categories to emails
- **Dashboard**: The main interface where classified emails are displayed
- **Category**: A classification label assigned to emails (Important, Promotional, Social, Marketing, Spam, General)
- **Session**: An authenticated user's active connection to the System
- **LocalStorage**: Browser-based storage for persisting user data client-side

## Requirements

### Requirement 1: User Authentication

**User Story:** As a User, I want to sign in with my Google account, so that the System can access my Gmail emails securely

#### Acceptance Criteria

1.1 WHEN the User visits the application, THE System SHALL display a sign-in button for Google authentication

1.2 WHEN the User clicks the sign-in button, THE System SHALL redirect the User to Google OAuth consent screen requesting Gmail read permissions

1.3 WHEN the User grants permissions, THE System SHALL create an authenticated Session with access to Gmail_API

1.4 WHEN authentication succeeds, THE System SHALL redirect the User to the Dashboard

1.5 WHEN the User is authenticated, THE System SHALL display the User profile information and provide a sign-out option

### Requirement 2: OpenAI API Key Management

**User Story:** As a User, I want to securely provide my OpenAI API key, so that the System can classify my emails using AI

#### Acceptance Criteria

2.1 WHEN the User accesses the Dashboard without a stored API key, THE System SHALL display a modal prompting for the OpenAI API key

2.2 WHEN the User enters an API key, THE System SHALL validate that the key starts with "sk-"

2.3 WHEN the API key is valid, THE System SHALL store the key in LocalStorage

2.4 WHEN the API key is stored, THE System SHALL enable email fetching functionality

2.5 WHEN the API key is invalid, THE System SHALL display an error message and prevent storage

### Requirement 3: Email Fetching

**User Story:** As a User, I want to fetch my recent emails from Gmail, so that I can see them classified in the application

#### Acceptance Criteria

3.1 WHEN the User clicks the fetch emails button, THE System SHALL retrieve fifteen most recent messages from Gmail_API using the User Session

3.2 WHEN Gmail_API returns messages, THE System SHALL extract the message identifier, sender address, subject line, preview text, and timestamp for each message

3.3 WHEN email data is extracted, THE System SHALL format each email as an Email object with identifier, sender, subject, snippet, and date fields

3.4 WHEN emails are fetched and classified, THE System SHALL store the classified emails in LocalStorage

3.5 WHEN the fetch operation is in progress, THE System SHALL display a loading indicator to the User

### Requirement 4: Email Classification

**User Story:** As a User, I want my emails automatically classified into categories, so that I can quickly identify different types of emails

#### Acceptance Criteria

4.1 WHEN the System receives fetched emails, THE System SHALL send each email to the Classification_Engine with the User provided OpenAI API key

4.2 WHEN the Classification_Engine processes an email, THE System SHALL provide the sender, subject, and snippet to OpenAI_API with category definitions

4.3 WHEN OpenAI_API returns a classification, THE System SHALL assign one category from Important, Promotional, Social, Marketing, Spam, or General to the email

4.4 WHEN the Classification_Engine cannot determine a category, THE System SHALL assign the General category as default

4.5 WHEN all emails are classified, THE System SHALL return the complete set of classified emails with assigned categories

### Requirement 5: Email Display and Organization

**User Story:** As a User, I want to view my classified emails organized by category, so that I can easily browse different types of emails

#### Acceptance Criteria

5.1 WHEN the Dashboard loads with classified emails, THE System SHALL group emails by their assigned Category

5.2 WHEN displaying an email, THE System SHALL show the sender address, subject line, preview text, timestamp, and category badge

5.3 WHEN rendering email cards, THE System SHALL apply category-specific color coding for visual distinction

5.4 WHEN displaying a Category section, THE System SHALL show the category name, email count, and list of emails in that category

5.5 WHEN the User interacts with a Category section, THE System SHALL allow expanding and collapsing the email list

### Requirement 6: Data Persistence

**User Story:** As a User, I want my classified emails and settings saved locally, so that I don't need to re-fetch emails every time I visit the application

#### Acceptance Criteria

6.1 WHEN emails are classified, THE System SHALL save the classified emails to LocalStorage

6.2 WHEN the Dashboard loads, THE System SHALL retrieve and display previously classified emails from LocalStorage

6.3 WHEN the fetch operation completes, THE System SHALL save the current timestamp to LocalStorage

6.4 WHEN the User signs out, THE System SHALL retain the LocalStorage data for future sessions

6.5 WHEN the User clicks clear data, THE System SHALL remove all classified emails from LocalStorage

### Requirement 7: User Interface and Experience

**User Story:** As a User, I want a clean and responsive interface, so that I can use the application on any device

#### Acceptance Criteria

7.1 WHEN the User accesses the application, THE System SHALL display a responsive layout that adapts to mobile and desktop screen sizes

7.2 WHEN the User views the Dashboard, THE System SHALL provide clear visual hierarchy with category sections and email cards

7.3 WHEN the User performs actions, THE System SHALL provide immediate visual feedback through loading states and status messages

7.4 WHEN errors occur, THE System SHALL display user-friendly error messages with actionable guidance

7.5 WHEN the User navigates the application, THE System SHALL maintain consistent styling and branding throughout

### Requirement 8: Configuration and Setup

**User Story:** As a developer, I want clear setup instructions and configuration, so that I can deploy and test the application

#### Acceptance Criteria

8.1 WHEN setting up the application, THE System SHALL require environment variables for Google OAuth client credentials and NextAuth configuration

8.2 WHEN configuring Google OAuth, THE System SHALL support adding test users including theindianappguy@gmail.com

8.3 WHEN the application starts, THE System SHALL validate that required environment variables are present

8.4 WHEN documentation is provided, THE System SHALL include step-by-step setup instructions for Google Cloud Console OAuth configuration

8.5 WHEN sharing the repository, THE System SHALL include comprehensive README documentation with setup, usage, and troubleshooting guidance
