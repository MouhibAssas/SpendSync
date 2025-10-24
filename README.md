SpendSync – Modern Money Management with Social Features

SpendSync is a modern web app designed to help users manage their money daily while connecting socially. It combines personal finance tracking with a social experience, letting users share and discover spending moments with friends and followers.

📌 Core Features
📊 Daily Expense Tracking

Log your expenses with an automatic 24-hour reset, keeping your spending habits up-to-date.

📱 Social Feed

Share spending moments with your followers — from daily essentials to exciting purchases — just like a BeReal for expenses.

👥 Friend & Profile System

Connect with friends, view their 24-hour expense posts, and discover new profiles.

🔍 Real-Time Search

Quickly find users and explore their public spending posts.

📈 Insights & Visuals

Get interactive visuals to understand your spending patterns over 1 week, 1 month, or 3 months. Default view shows the last 24 hours.

✅ Private or Public Spending

Most expenses are private, but you can share specific purchases publicly with a photo — for example, a new keyboard, a mouse, or your grocery haul.

🎨 Modern UI

Designed with Tailwind CSS for a clean, responsive, and visually appealing interface.

💻 Tech Stack

Frontend: React.js + Tailwind CSS

Backend: Node.js + Express.js

Database: MongoDB

Authentication: JWT + bcrypt

Real-Time Features: Socket.IO

Validation & Security: express-validator

API Communication: Axios

🧩 Architecture Overview
spendsync/
 ├── client/
 │    ├── src/
 │    │    ├── components/     # UI Components
 │    │    ├── pages/          # App Pages
 │    │    ├── context/        # React Context / State
 │    │    ├── services/       # API calls
 │    │    └── App.jsx
 │    └── tailwind.config.js
 │
 ├── server/
 │    ├── controllers/         # Business logic
 │    ├── routes/              # API routes
 │    ├── models/              # MongoDB Schemas
 │    ├── middleware/          # JWT auth, validation
 │    ├── server.js
 │    └── config/
 │
 ├── package.json
 ├── README.md
 └── AI_CONTEXT.md             # For AI assistants

🔄 Data Flow Overview

User Authentication

Register → password hashed (bcrypt)

Login → JWT issued

Protected routes verified by JWT middleware

Expense Management

User adds an expense → stored in MongoDB

Optionally share publicly → appears in social feed

Real-Time Updates

Socket.IO handles live feed and notifications

Friends see updates instantly

🎯 Notes

SpendSync is more than an expense tracker — it’s a fun, social, and insightful way to manage your money.

Designed for privacy-first: most expenses are private by default.

Frontend follows Tailwind conventions for responsive, modern UI.

Backend ensures secure handling of authentication and data.