# LinkedIn Content Creation Agent

A complete, production-ready MERN (MongoDB, Express, React, Node.js) application that automates highly structured, beautifully-spaced LinkedIn content campaigns emulating the viral copywriting style of Nikit Bassi (Founder of NB Media). It leverages **Retrieval-Augmented Generation (RAG)** via the **Google Gemini API** to ensure consistency in hook formulation, layout spacing, pacing, CTAs, and storytelling styles.

---

## 🚀 Key Features

1. **RAG-Powered Writing Style Training**
   - Store highly successful organic writing templates in the **Style Library** collection (`stylePosts`).
   - Retrieves similar contextual copywriting blueprints automatically prior to triggering creative models.
2. **Dashboard Command Center**
   - Visual statistics tracking total generations, automated trends queries, system states, and fast tool shortcuts.
3. **Advanced Campaign Parameters**
   - Refined input dials supporting: Target Industry, Specific Audience personas, Tonality configurations, and Core Topics.
4. **News-Driven Auto-Research Center**
   - Automatic tech news parsing and synthesis using `NewsAPI` (with scrapers/simulated trending news fallback).
   - Summarizes articles, identifies strategy concepts, and builds reactions on the fly.
5. **Midjourney Prompt Synthesis**
   - Provides elaborate photographic prompts styled for Midjourney/DALL-E 3 matching the specific post's tone.
6. **Visual Calendar Planner**
   - Fully interactive schedule planner containing editable cards to preview layouts, change date triggers, and swap draft statuses.
7. **Production Analytics Views**
   - Animated daily production trends and topic graphs using **Recharts**.
8. **Secure Authentication**
   - JWT validation, hashed credentials, private route shields, and persistent session locks.

---

## 📂 Project Structure

```
Linkedln/
├── client/                     # React Vite Frontend Application
│   ├── src/
│   │   ├── components/         # Premium UI Components & Mockups
│   │   │   ├── GlassCard.jsx   # Glassmorphic Hover Container
│   │   │   ├── Layout.jsx      # Navigation Sidebar Layout
│   │   │   └── NikBassiPostPreview.jsx # Live LinkedIn Simulated Post
│   │   ├── context/
│   │   │   └── AuthContext.jsx # JWT State Context & Interceptors
│   │   ├── pages/              # Main App Pages
│   │   │   ├── Analytics.jsx   # Metrics Charts (Recharts)
│   │   │   ├── ContentCalendar.jsx # Scheduler Planner
│   │   │   ├── Dashboard.jsx   # Command Center Overview
│   │   │   ├── GenerateContent.jsx # AI Copywriting Generator
│   │   │   ├── Login.jsx       # Slick Login Portal
│   │   │   ├── Register.jsx    # Signup Form
│   │   │   ├── ResearchCenter.jsx # Auto-Research Portal
│   │   │   └── StyleLibrary.jsx   # Style Training Library
│   │   ├── App.jsx             # Main Routing & Protected Guards
│   │   ├── index.css           # Styling Foundation
│   │   └── main.jsx            # DOM Renderer Hook
│   ├── tailwind.config.js      # Tailwind Config (Outfit/Inter Fonts)
│   ├── vite.config.js          # Vite Server & Proxy Configs
│   └── package.json            # Client Dependencies
├── server/                     # Express Node.js Backend API
│   ├── config/
│   │   └── db.js               # MongoDB Mongoose Client Connection
│   ├── controllers/            # Feature Controller Logic
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── calendarController.js
│   │   ├── generateController.js
│   │   ├── researchController.js
│   │   └── styleController.js
│   ├── middleware/
│   │   └── auth.js             # JWT Security Guard Middleware
│   ├── models/                 # Database Schemas
│   │   ├── AnalyticsLog.js
│   │   ├── CalendarEvent.js
│   │   ├── StylePost.js
│   │   └── User.js
│   ├── routes/                 # Express Endpoint Routers
│   │   ├── analytics.js
│   │   ├── auth.js
│   │   ├── calendar.js
│   │   ├── generate.js
│   │   ├── research.js
│   │   └── style.js
│   ├── services/               # Core Integrations
│   │   ├── aiService.js        # Gemini API Connection & Mock Mocks
│   │   └── newsService.js      # News Feed Connector & RSS Scraper
│   ├── .env                    # System Configurations
│   ├── server.js               # Main Server entrypoint
│   └── package.json            # Server Dependencies
└── README.md                   # Complete Documentation
```

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v16.0.0 or later)
- **MongoDB** (Local instance or Atlas Connection string)

### 1. Configure the Backend Server
```bash
# Navigate to the server folder
cd server

# Install dependecies
npm install

# Create/Verify your environment file
cat .env
```
Ensure your `.env` contains:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/linkedin_agent
JWT_SECRET=super_secret_jwt_token_for_linkedin_agent_12345
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
NEWS_API_KEY=YOUR_NEWS_API_KEY_HERE
```
*Note: If no Gemini/News API key is configured, the server defaults seamlessly to a rich demo environment ensuring robust operation during reviews!*

### 2. Configure the Frontend Client
```bash
# Navigate to the client folder
cd ../client

# Install dependencies
npm install

# Run the development server
npm run dev
```

### 3. Running the Entire Application Locally
- Start the backend: `cd server && npm run dev` (Runs on `http://localhost:5001`)
- Start the frontend: `cd client && npm run dev` (Runs on `http://localhost:3000` with local API proxying!)

---

## 🔌 API Reference Guide

All protected endpoints require sending `Authorization: Bearer <JWT_Token>` inside headers.

### 🛡️ Authentication Endpoints
- `POST /api/auth/register` : User Signup
  - Payload: `{ "username": "John", "email": "j@c.co", "password": "password" }`
- `POST /api/auth/login` : Token Exchange
  - Payload: `{ "email": "j@c.co", "password": "password" }`
- `GET /api/auth/me` : Current User profile details

### 🧠 Style training collection (`/api/style`)
- `GET /api/style` : Fetch all trained style examples.
- `POST /api/style` : Save new writing template to RAG collection.
  - Payload: `{ "title": "B2B Scale Hook", "category": "Marketing", "content": "..." }`
- `PUT /api/style/:id` : Update template details.
- `DELETE /api/style/:id` : Remove template.

### ⚡ Generation & Automation (`/api/generate` & `/api/research`)
- `POST /api/generate` : Dynamic Spaced Post Generator
  - Payload: `{ "topic": "AI Spreasheets", "industry": "AI", "audience": "Founders", "tone": "Direct" }`
  - Output: `{ "success": true, "data": { "post": "...", "imageIdea": { "imageTitle": "...", "imagePrompt": "..." } } }`
- `GET /api/research` : Trends parsing & reactions summarization

### 📅 Calendar Scheduler (`/api/calendar`)
- `GET /api/calendar` : Fetch scheduled events list.
- `POST /api/calendar` : Save calendar draft.
- `PUT /api/calendar/:id` : Modify calendar event properties.
- `DELETE /api/calendar/:id` : Delete schedule.

---

## ✍️ Copywriting Style Emulation Benchmarks

The Gemini API models are structured using strict context constraints to emulate observable high-conversion LinkedIn writing characteristics:

- **The scroll-stopping hook:** High-contrast first line, single sentence, creating high curiosity or a contrarian observation. No fluff.
- **Micro-line spacing:** Paragraphs restricted to **1-2 sentences maximum** separated by a double line break (`\n\n`) to increase flow speed.
- **Conversion bullet points:** Key lessons structured using clear numbers or clean dashes, avoiding chunky block paragraphs.
- **Zero AI-tonal indicators:** Filtered out generic transitions (e.g. "delve", "testament", "tapestry", "in today's ecosystem").
- **Engagement-driven CTA:** Short questions leading users to voice comments immediately.
