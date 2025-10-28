# 📧 Email Classifier App

An intelligent Gmail email classification system powered by AI that automatically categorizes your emails into meaningful groups using OpenAI GPT-4o or Google Gemini 2.0 Flash.

![Email Classifier Dashboard](Screenshot%202025-10-28%20124543.png)

## ✨ Features

- 🤖 **Dual AI Provider Support**: Choose between OpenAI GPT-4o or Google Gemini 2.0 Flash for email classification
- 📊 **Smart Categorization**: Automatically classifies emails into 6 categories:
  - 🔴 Urgent & Important
  - 🟡 Important but Not Urgent
  - 🔵 Informational
  - 🟢 Promotional
  - ⚪ General
  - 🗑️ Spam/Junk
- 🔐 **Secure OAuth Authentication**: Gmail integration via Google OAuth 2.0
- 📱 **Responsive UI**: Clean, modern interface built with Tailwind CSS
- 📧 **Full Email View**: Click any email to view complete content with HTML rendering
- 💾 **Local Storage**: Classified emails are cached locally for quick access
- 🔄 **Real-time Classification**: Fetch and classify emails on demand

## 🖼️ Screenshots

### Dashboard View
![Dashboard with categorized emails](Screenshot%202025-10-28%20124543.png)

### Email Detail View
![Email detail panel with full content](Screenshot%202025-10-28%20124638.png)

### API Key Configuration
![API key setup modal](Screenshot%202025-10-28%20130355.png)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Cloud Project with Gmail API enabled
- OpenAI API key OR Google AI Studio API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd email-classifier-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   
   # AI Provider API Keys (configure at least one)
   OPENAI_API_KEY=your_openai_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Copy the Client ID and Client Secret to your `.env.local`

### AI Provider Setup

#### Option 1: OpenAI
1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to `.env.local` as `OPENAI_API_KEY`

#### Option 2: Google Gemini
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to `.env.local` as `GEMINI_API_KEY`

### NextAuth Secret

Generate a secure random string for `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## 📖 Usage

1. **Sign In**: Click "Sign in with Google" to authenticate with your Gmail account
2. **Configure AI Provider**: On first use, you'll be prompted to select and configure your AI provider (OpenAI or Gemini)
3. **Fetch Emails**: Click "Fetch Emails" to retrieve your recent emails
4. **View Classifications**: Emails are automatically classified and organized by category
5. **View Details**: Click on any email card to see the full email content
6. **Reclassify**: Use the "Classify Emails" button to re-run classification with updated settings

## 🏗️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **AI Integration**: 
  - [LangChain](https://js.langchain.com/)
  - [OpenAI](https://openai.com/)
  - [Google Gemini](https://ai.google.dev/)
- **Email API**: [Gmail API](https://developers.google.com/gmail/api)

## 📁 Project Structure

```
email-classifier-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth authentication
│   │   └── emails/               # Email fetching & classification
│   ├── dashboard/                # Main dashboard page
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── ApiKeyModal.tsx          # AI provider configuration
│   ├── AuthButton.tsx           # Authentication button
│   ├── CategorySection.tsx      # Email category display
│   ├── EmailCard.tsx            # Individual email card
│   ├── EmailDetailModal.tsx     # Email detail modal (deprecated)
│   ├── EmailDetailPanel.tsx     # Email detail panel
│   └── EmailList.tsx            # Email list container
├── lib/                         # Utility functions
│   ├── emailService.ts          # Email classification logic
│   └── storage.ts               # Local storage utilities
├── types/                       # TypeScript definitions
│   └── email.ts                 # Email type definitions
├── .kiro/                       # Kiro AI specs
│   └── specs/
│       └── email-classifier-app/
│           ├── requirements.md  # Feature requirements
│           ├── design.md        # System design
│           └── tasks.md         # Implementation tasks
└── public/                      # Static assets
```

## 🎯 Email Categories

The AI classifies emails into the following categories:

| Category | Description | Use Case |
|----------|-------------|----------|
| **Urgent & Important** | Time-sensitive emails requiring immediate action | Deadlines, critical issues, urgent requests |
| **Important but Not Urgent** | Significant emails that can be addressed later | Project updates, important announcements |
| **Informational** | Newsletters, updates, and FYI emails | Industry news, company updates, reports |
| **Promotional** | Marketing and promotional content | Sales, offers, advertisements |
| **General** | Routine correspondence | General inquiries, casual communication |
| **Spam/Junk** | Unwanted or suspicious emails | Phishing attempts, irrelevant content |

## 🔒 Security & Privacy

- **OAuth 2.0**: Secure authentication with Google
- **Local Storage**: Classified emails are stored locally in your browser
- **API Keys**: Stored securely in environment variables
- **No Data Persistence**: Email content is not stored on any server
- **Read-Only Access**: The app only reads emails, never modifies or deletes them

## 🛠️ Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## 🐛 Troubleshooting

### "Invalid API Key" Error
- Verify your API key is correctly set in `.env.local`
- Ensure you've selected the correct AI provider in the settings
- Check that your API key has sufficient credits/quota

### "Failed to Fetch Emails"
- Confirm Gmail API is enabled in Google Cloud Console
- Verify OAuth credentials are correct
- Check that redirect URIs match exactly

### Classification Not Working
- Ensure at least one AI provider API key is configured
- Check browser console for detailed error messages
- Verify you have sufficient API quota remaining

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on the GitHub repository.

---

Built with ❤️ using Next.js and AI
#   E m a i l - c l a s s i f i e r s  
 