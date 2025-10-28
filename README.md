<div align="center">

# 📧✨ Email Classifier App

### Intelligent Gmail Classification powered by AI

*Automatically categorize your emails using OpenAI GPT-4o or Google Gemini 2.0 Flash*

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

![Email Classifier Dashboard](Screenshot%202025-10-28%20124543.png)

[Features](#-features) • [Screenshots](#-screenshots) • [Quick Start](#-quick-start) • [Documentation](#-tech-stack)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🤖 **Dual AI Power**
Choose between OpenAI GPT-4o or Google Gemini 2.0 Flash for intelligent email classification

### 📊 **Smart Categorization**
Automatically sorts emails into 6 intuitive categories for better inbox management

### 🔐 **Secure & Private**
OAuth 2.0 authentication with local-only storage - your data never leaves your device

</td>
<td width="50%">

### 📱 **Modern Interface**
Beautiful, responsive UI built with Tailwind CSS for seamless experience across devices

### 💾 **Lightning Fast**
Local caching ensures quick access to your classified emails

### 🔄 **Real-time Processing**
Fetch and classify emails on demand with instant results

</td>
</tr>
</table>

---

## 📬 Email Categories

<div align="center">

| Icon | Category | Purpose |
|:----:|----------|---------|
| 🔴 | **Urgent & Important** | Time-sensitive emails requiring immediate action |
| 🟡 | **Important but Not Urgent** | Significant emails that can wait |
| 🔵 | **Informational** | Newsletters, updates, and FYI content |
| 🟢 | **Promotional** | Marketing and special offers |
| ⚪ | **General** | Routine correspondence |
| 🗑️ | **Spam/Junk** | Unwanted or suspicious content |

</div>

---

## 📸 Screenshots

<div align="center">

### 🎯 Dashboard View
*Organized email categories at a glance*

![Dashboard](Screenshot%202025-10-28%20124543.png)

### 📧 Email Details
*Full content view with HTML rendering*

![Email Detail](Screenshot%202025-10-28%20124638.png)

### ⚙️ Configuration
*Easy AI provider setup*

![API Configuration](Screenshot%202025-10-28%20130355.png)

</div>

---

## 🚀 Quick Start

### Prerequisites

```
✅ Node.js 18 or higher
✅ Google Cloud Project with Gmail API
✅ OpenAI API key OR Google AI Studio API key
```

### Installation

#### 1️⃣ Clone & Install

```bash
git clone <repository-url>
cd email-classifier-app
npm install
```

#### 2️⃣ Configure Environment

Create `.env.local` in the root directory:

```env
# 🔑 Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# 🔐 NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# 🤖 AI Providers (configure at least one)
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
```

#### 3️⃣ Launch

```bash
npm run dev
```

🎉 Open [http://localhost:3000](http://localhost:3000) and start classifying!

---

## 🔧 Configuration Guide

<details>
<summary><b>🌐 Google Cloud Setup</b></summary>

<br>

1. Navigate to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable **Gmail API**
4. Create **OAuth 2.0 credentials**:
   - Type: Web application
   - Redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy credentials to `.env.local`

</details>

<details>
<summary><b>🤖 AI Provider Setup</b></summary>

<br>

**Option A: OpenAI**
- Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- Add as `OPENAI_API_KEY` in `.env.local`

**Option B: Google Gemini**
- Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Add as `GEMINI_API_KEY` in `.env.local`

</details>

<details>
<summary><b>🔐 Generate NextAuth Secret</b></summary>

<br>

```bash
openssl rand -base64 32
```

</details>

---

## 📖 How to Use

**Step-by-step workflow:**

1. **🔐 Sign In** → Authenticate with your Google account
2. **⚙️ Configure AI** → Select your preferred AI provider (OpenAI or Gemini)
3. **📥 Fetch Emails** → Retrieve recent messages from your inbox
4. **🤖 Auto-Classify** → AI automatically categorizes your emails
5. **📧 View & Manage** → Browse emails organized by category
6. **🔄 Reclassify** → Update classifications anytime with new settings

---

## 🏗️ Tech Stack

<div align="center">

| Category | Technologies |
|----------|-------------|
| **Framework** | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) |
| **Auth** | ![NextAuth](https://img.shields.io/badge/NextAuth.js-000000?style=flat&logo=next.js&logoColor=white) |
| **AI** | ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white) ![Google](https://img.shields.io/badge/Gemini-4285F4?style=flat&logo=google&logoColor=white) |
| **Integration** | ![Gmail API](https://img.shields.io/badge/Gmail_API-EA4335?style=flat&logo=gmail&logoColor=white) ![LangChain](https://img.shields.io/badge/LangChain-121212?style=flat&logo=chainlink&logoColor=white) |

</div>

---

## 📁 Project Structure

```
email-classifier-app/
│
├── 📱 app/                          Next.js App Router
│   ├── api/                        API endpoints
│   │   ├── auth/                   Authentication
│   │   └── emails/                 Email operations
│   ├── dashboard/                  Main dashboard
│   └── page.tsx                    Landing page
│
├── 🧩 components/                   React components
│   ├── ApiKeyModal.tsx            AI configuration
│   ├── AuthButton.tsx             Auth UI
│   ├── CategorySection.tsx        Category display
│   ├── EmailCard.tsx              Email cards
│   └── EmailDetailPanel.tsx       Detail view
│
├── 🛠️ lib/                          Utilities
│   ├── emailService.ts            Classification logic
│   └── storage.ts                 Local storage
│
├── 📝 types/                        TypeScript types
│   └── email.ts                   Email definitions
│
└── 🎨 public/                       Static assets
```

---

## 🔒 Security & Privacy

<div align="center">

| Feature | Implementation |
|---------|---------------|
| 🔐 **Authentication** | OAuth 2.0 with Google |
| 💾 **Data Storage** | Local browser storage only |
| 🔑 **API Keys** | Secure environment variables |
| 📧 **Email Access** | Read-only permissions |
| 🚫 **Data Persistence** | No server-side storage |

</div>

> **Privacy First**: Your emails are processed locally and never stored on external servers. The app only reads emails and never modifies or deletes them.

---

## 🛠️ Development

### Build for Production

```bash
npm run build
npm start
```

### Code Quality

```bash
# Linting
npm run lint

# Type Checking
npx tsc --noEmit
```

---

## 🐛 Troubleshooting

<details>
<summary><b>❌ "Invalid API Key" Error</b></summary>

<br>

- ✅ Verify API key in `.env.local`
- ✅ Confirm correct provider selected
- ✅ Check API quota/credits

</details>

<details>
<summary><b>📧 "Failed to Fetch Emails"</b></summary>

<br>

- ✅ Enable Gmail API in Google Cloud
- ✅ Verify OAuth credentials
- ✅ Check redirect URIs match exactly

</details>

<details>
<summary><b>🤖 Classification Issues</b></summary>

<br>

- ✅ Ensure AI provider configured
- ✅ Check browser console for errors
- ✅ Verify API quota remaining

</details>

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💻 Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🎉 Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

<div align="center">

**Need help? Have questions?**

[![Open Issue](https://img.shields.io/badge/Open-Issue-red?style=for-the-badge&logo=github)](https://github.com/yourusername/email-classifier-app/issues)
[![Discussions](https://img.shields.io/badge/Join-Discussions-blue?style=for-the-badge&logo=github)](https://github.com/yourusername/email-classifier-app/discussions)

</div>

---

<div align="center">

### Built with ❤️ using Next.js and AI

**[⭐ Star this repo](https://github.com/yourusername/email-classifier-app)** if you find it useful!

*Made with 🤖 by developers, for developers*

</div>
