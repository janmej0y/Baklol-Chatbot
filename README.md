# 🤖 Baklol - Full Stack AI Chatbot

A production-ready, full-stack AI chatbot built with **Next.js 15**, **MongoDB**, and **Google Gemini API**. It features a secure authentication system, persistent chat history, and a smart rate-limiting engine.

![Baklol Preview](public/preview.png)

## ✨ Features

### 🧠 Core AI & UI
- **Smart AI:** Powered by Google's **Gemini 2.5 Flash** model for fast, accurate responses.
- **Modern UI/UX:** Clean, centered interface with **Dark/Light Mode** and smooth Framer Motion animations.
- **Rich Text:** Renders Markdown (Headings, Lists, Bold/Italic) and Syntax Highlighting for code blocks.
- **Responsive:** Fully optimized for Mobile & Desktop.

### 🔐 Security & Data (New)
- **Google Authentication:** Secure login via **NextAuth v5**. Users must log in to chat.
- **Persistent Memory:** All chat history is saved to **MongoDB** and loads automatically when you return.
- **User Profiles:** Displays real Google profile pictures and names.

### 🛡️ Smart Limits & Logic (New)
- **Strict Rate Limiting:**
  - Users are limited to **10 messages** per cycle.
  - **28-Day Reset:** After the limit is reached, the user is blocked for 28 days.
- **Visual Locking:** The chat input automatically disables and turns red when the limit is reached.
- **Auto-Retry System:** The backend automatically handles API rate limits (HTTP 429) from Google, ensuring requests don't fail under load.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Database:** [MongoDB](https://www.mongodb.com/) (via Mongoose)
- **Authentication:** [NextAuth.js v5](https://authjs.dev/)
- **AI Model:** [Google Gemini API](https://ai.google.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/baklol.git](https://github.com/your-username/baklol.git)
cd baklol
2. Install Dependencies
Bash

npm install
3. Configure Environment Variables
Create a .env.local file in the root directory. You will need credentials from Google Cloud and MongoDB Atlas.

Bash

touch .env.local
Paste the following configuration:

Code snippet

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# MongoDB Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth / Google Login
AUTH_SECRET=your_random_secret_string
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
Note:

Get Gemini Key from Google AI Studio.

Get Google ID/Secret from Google Cloud Console.

Get MongoDB URI from MongoDB Atlas.

4. Run the Development Server
Bash

npm run dev
Open http://localhost:3000 in your browser.

📂 Project Structure
Bash

src/
├── app/
│   ├── api/
│   │   ├── auth/        # NextAuth Handlers
│   │   └── chat/        # AI Logic & Rate Limiting
│   ├── actions.ts       # Server Actions (Login/Logout)
│   └── page.tsx         # Main Server Component
├── components/
│   ├── ui/              # Chat Bubbles, Inputs, Buttons
│   └── chat-interface.tsx # Client-side Chat Logic
├── lib/
│   └── db.ts            # MongoDB Connection Helper
├── models/
│   └── Chat.ts          # Mongoose Schema
└── auth.ts              # Authentication Config
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
Distributed under the MIT License.