# Implementation Plan

- [x] 1. Initialize Next.js project with TypeScript and Tailwind CSS





  - Create new Next.js 14+ project with App Router
  - Configure TypeScript with strict mode
  - Set up Tailwind CSS with custom configuration
  - Create basic project structure (components, lib, types directories)
  - _Requirements: 7.5_

- [x] 2. Set up type definitions and interfaces





  - Create `types/email.ts` with EmailCategory type and Email interface
  - Define ClassifiedEmail interface extending Email
  - Create API response types (FetchEmailsResponse, ClassifyEmailsResponse)
  - Define ClassifyEmailsRequest interface
  - _Requirements: 3.3, 4.3_

- [x] 3. Configure NextAuth.js with Google OAuth





  - Install next-auth and required dependencies
  - Create `app/api/auth/[...nextauth]/route.ts` with NextAuth configuration
  - Configure Google OAuth provider with required scopes (gmail.readonly, userinfo.email, userinfo.profile)
  - Set up session strategy and callbacks for token handling
  - Create `.env.example` file documenting required environment variables
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 8.3_

- [x] 4. Build authentication UI components




  - [x] 4.1 Create AuthButton component


    - Implement sign in/sign out functionality using NextAuth
    - Display user profile information when authenticated
    - Show loading state during authentication
    - _Requirements: 1.1, 1.5_
  
  - [x] 4.2 Create landing page (app/page.tsx)


    - Display login button when user is not authenticated
    - Show application description and features
    - Redirect to dashboard when authenticated
    - Apply Tailwind styling for responsive design
    - _Requirements: 1.1, 1.5_

- [x] 5. Implement localStorage utilities





  - Create `lib/storage.ts` with functions for localStorage operations
  - Implement saveToLocalStorage and getFromLocalStorage helpers
  - Add error handling for QuotaExceededError and SecurityError
  - Create functions for storing/retrieving OpenAI key, emails, and timestamps
  - _Requirements: 2.3, 3.4, 6.1, 6.2, 6.3_

- [-] 6. Build OpenAI API key management


  - [x] 6.1 Create ApiKeyModal component


    - Build modal UI with input field for API key
    - Implement key format validation (starts with "sk-")
    - Save validated key to localStorage
    - Show/hide modal based on key presence
    - Display error messages for invalid keys
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 6.2 Integrate API key check in dashboard



    - Check localStorage for existing API key on mount
    - Show ApiKeyModal if key is not present
    - Enable email fetching only when key is available
    - _Requirements: 2.4, 2.5_

- [x] 7. Implement Gmail API integration





  - [x] 7.1 Create fetch emails API route (app/api/emails/fetch/route.ts)

    - Install googleapis package
    - Verify user session and extract access token
    - Initialize Gmail API client with user's access token
    - Fetch 15 most recent messages using gmail.users.messages.list
    - _Requirements: 3.1, 3.2_
  
  - [x] 7.2 Parse and format email data

    - For each message ID, fetch full message details
    - Extract sender from headers (From field)
    - Extract subject from headers (Subject field)
    - Extract date from headers (Date field)
    - Get email snippet or body text
    - Return formatted Email objects array
    - _Requirements: 3.3_
  

  - [ ] 7.3 Add error handling for Gmail API
    - Handle 401 Unauthorized errors (token refresh)
    - Handle 403 Forbidden errors (permission issues)
    - Handle 429 Rate Limit errors
    - Handle 500 Server errors
    - Return appropriate error responses
    - _Requirements: 3.1_

- [x] 8. Implement email classification with Langchain.js




  - [x] 8.1 Create classify emails API route (app/api/emails/classify/route.ts)


    - Install @langchain/openai and @langchain/core packages
    - Accept emails array and OpenAI API key in request body
    - Initialize ChatOpenAI model with GPT-4o and user's API key
    - _Requirements: 4.1, 4.2_
  

  - [x] 8.2 Build classification logic



    - Create classification prompt template with category definitions
    - Set up PromptTemplate and chain with ChatOpenAI model
    - Process each email through the classification chain
    - Parse category from model response
    - Assign "General" category if parsing fails
    - Return ClassifiedEmail objects array
    - _Requirements: 4.2, 4.3, 4.4, 4.5_
  
  - [x] 8.3 Add error handling for OpenAI API







  - [-] 8.3 Add error handling for OpenAI API


    - Handle 401 Unauthorized errors (invalid API key)
    - Handle 429 Rate Limit errors (quota exceeded)
    - Handle 500 Server errors (fallback to General category)
    - Return appropriate error responses
    - _Requirements: 4.4_

- [ ] 9. Build dashboard page and email display components





  - [x] 9.1 Create protected dashboard page (app/dashboard/page.tsx)


    - Implement session check and redirect to login if not authenticated
    - Load classified emails from localStorage on mount
    - Implement "Fetch Emails" button with loading state
    - Implement "Clear Data" button to remove localStorage data
    - Handle fetch and classify workflow
    - Display loading spinner during operations
    - _Requirements: 3.4, 3.5, 6.2, 6.5_
  
  - [x] 9.2 Create EmailCard component


    - Display sender, subject, snippet, and formatted date
    - Show category badge with color coding
    - Apply Tailwind styling for card layout
    - Make component responsive
    - _Requirements: 5.2, 5.3_
  
  - [x] 9.3 Create CategorySection component


    - Accept category, emails array, and count as props
    - Implement expand/collapse functionality
    - Display category icon and name
    - Show email count for category
    - Apply category-specific color theme
    - Render EmailCard components for emails in category
    - _Requirements: 5.1, 5.4, 5.5_
  
  - [x] 9.4 Create EmailList component


    - Group emails by category
    - Calculate count for each category
    - Render CategorySection for each category (Important, Promotional, Social, Marketing, Spam, General)
    - Handle empty state when no emails are present
    - _Requirements: 5.1, 5.4_

- [x] 10. Implement client-side email fetching and classification flow





  - Create `lib/emailService.ts` with client-side functions
  - Implement fetchEmails function to call /api/emails/fetch
  - Implement classifyEmails function to call /api/emails/classify
  - Create orchestration function to fetch, classify, and store emails
  - Add error handling and user feedback for each step
  - Store classified emails and timestamp in localStorage
  - _Requirements: 3.1, 3.4, 3.5, 4.1, 4.5, 6.1_

- [ ] 11. Add loading states and error handling UI
  - [ ] 11.1 Create LoadingSpinner component
    - Build animated spinner with Tailwind
    - Make it reusable across the application
    - _Requirements: 3.5_
  
  - [ ] 11.2 Implement toast notification system
    - Install or create toast notification library
    - Display success messages for completed operations
    - Display error messages with actionable information
    - Auto-dismiss non-critical notifications
    - _Requirements: 3.1, 4.1_
  
  - [ ] 11.3 Add error boundaries
    - Create error boundary component for React errors
    - Display user-friendly error messages
    - Provide retry or reset options
    - _Requirements: 3.1, 4.1_

- [ ] 12. Build layout components
  - [ ] 12.1 Create Header component
    - Display application logo and title
    - Show AuthButton with user profile
    - Make header responsive
    - _Requirements: 1.5_
  
  - [ ] 12.2 Create Footer component
    - Add copyright information
    - Include relevant links
    - Apply consistent styling
    - _Requirements: 7.5_
  
  - [ ] 12.3 Create root layout (app/layout.tsx)
    - Wrap application with NextAuth SessionProvider
    - Include Header and Footer
    - Set up global styles and fonts
    - Configure metadata for SEO
    - _Requirements: 1.5, 7.5_

- [ ] 13. Implement data persistence and caching
  - Add logic to check for cached emails on dashboard load
  - Display cached emails immediately while allowing refresh
  - Store last fetch timestamp in localStorage
  - Show timestamp of last fetch to user
  - Implement clear data functionality to remove all localStorage items
  - _Requirements: 6.1, 6.2, 6.5_

- [ ] 14. Add responsive design and styling
  - Ensure all components are mobile-responsive
  - Apply consistent color scheme across application
  - Implement category-specific colors (Important: red, Promotional: purple, Social: blue, Marketing: green, Spam: gray, General: yellow)
  - Add hover states and transitions
  - Optimize layout for different screen sizes
  - _Requirements: 5.3, 7.5_

- [ ] 15. Create comprehensive README documentation
  - Write project overview and feature list
  - Document technology stack
  - Provide step-by-step setup instructions
  - Include Google Cloud Console OAuth setup guide with screenshots
  - Document how to add test users (theindianappguy@gmail.com)
  - List all required environment variables
  - Add usage instructions for the application
  - Include project structure explanation
  - Add troubleshooting section for common issues
  - Document how to share repository with @theindianappguy
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.5_

- [ ] 16. Set up environment configuration
  - Create `.env.local` file with placeholder values
  - Create `.env.example` with documented variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_URL, NEXTAUTH_SECRET)
  - Add `.env.local` to .gitignore
  - Document environment variable setup in README
  - _Requirements: 7.2, 8.1_

- [ ] 17. Implement session management and logout
  - Add logout functionality to AuthButton
  - Clear NextAuth session on logout
  - Retain localStorage data after logout (as per requirements)
  - Redirect to landing page after logout
  - Handle session expiration gracefully
  - _Requirements: 1.5, 6.4_

- [ ]* 18. Add code documentation and comments
  - Add JSDoc comments to all functions and components
  - Document complex logic with inline comments
  - Add type descriptions to interfaces
  - Document API routes with request/response examples
  - _Requirements: 7.4_

- [ ]* 19. Perform manual testing
  - Test complete authentication flow
  - Verify API key modal and validation
  - Test email fetching with 15 messages
  - Verify email classification accuracy
  - Test localStorage persistence across page refreshes
  - Verify clear data functionality
  - Test responsive design on mobile devices
  - Verify error handling for various scenarios
  - _Requirements: All requirements_

- [ ]* 20. Optimize performance
  - Implement React.memo for EmailCard components
  - Add debouncing to fetch button
  - Optimize re-renders in EmailList
  - Test and verify loading states
  - _Requirements: 3.5, 5.1_
