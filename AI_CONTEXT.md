# 🧠 SpendSync / SocialExpenseTracker — AI Context Guide

## Overview
SpendSync is a **modern web app** for managing daily expenses while providing a **social experience**. Users can log expenses, share select purchases with followers, and explore friends’ spending activity.

---

## 🎯 Project Goals
- Daily expense tracking with automatic 24-hour reset  
- Social feed for sharing spending moments  
- Friend & profile system for connecting and discovering users  
- Real-time search for users and public posts  
- Interactive insights and visualizations of spending patterns  
- Option to keep expenses private or share publicly with photos  
- Modern, responsive UI using Tailwind CSS  

---

## 🧩 Architecture Overview

### Frontend (spendsync / React + Tailwind)
- **Framework:** React.js  
- **Styling:** Tailwind CSS  
- **State Management:** useState, useContext (or Redux if added)  
- **Routing:** React Router  
- **API Communication:** Axios or Fetch  
- **Main Folders:**
  - `/spendsync/src/components` → UI components  
  - `/spendsync/src/pages` → Page views  
  - `/spendsync/src/context` → React context / global state  
  - `/spendsync/src/services` → API calls  
  - `/spendsync/src/assets` → Images, icons  

### Backend (server / Node.js + Express)
- **Framework:** Express.js  
- **Database:** MongoDB (via Mongoose)  
- **Authentication:** JWT + bcrypt  
- **Validation:** express-validator  
- **Real-Time:** Socket.IO  
- **Main Folders (inside `server/src/`):**
  - `controllers/` → Business logic  
  - `routes/` → API endpoints  
  - `models/` → Mongoose schemas  
  - `middleware/` → JWT, validation, error handling  
  - `config/` → Environment and configuration files  
  - `realtime/` → Socket.IO handlers / events  
  - `utils/` → Helper functions  
  - `services/` → Business-related backend services  

---

## 🔐 Key Dependencies
| Category | Libraries |
|----------|------------|
| Backend | express, mongoose, jsonwebtoken, bcrypt, express-validator, socket.io |
| Frontend | react, react-dom, tailwindcss, axios, react-router-dom |
| Dev Tools | nodemon, dotenv |

---

## 🔄 Data Flow
1. **User Authentication**
   - Register → bcrypt hashes password  
   - Login → server issues JWT  
   - Protected routes validated with JWT middleware  

2. **Expense Management**
   - Add expense → stored in MongoDB  
   - Optional public sharing → appears in social feed  

3. **Real-Time Updates**
   - Socket.IO handles live feed and notifications  
   - Friends see updates instantly  

---

## 📦 Folder Structure
SocialExpenseTracker/
├── spendsync/ # Frontend
│ ├── src/components/
│ ├── src/pages/
│ ├── src/context/
│ ├── src/services/
│ ├── src/assets/
│ └── App.jsx
│
├── server/ # Backend
│ └── src/
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ ├── config/
│ ├── realtime/
│ ├── utils/
│ └── services/
├── server.js
├── package.json
├── README.md
└── AI_CONTEXT.md


---

## ⚙️ AI Assistant Instructions
> If you are an AI assistant (Cursor, Copilot, etc.), use this file as the **source of truth** for this project.  
> When context is lost or a session starts, **re-read this file** before generating or modifying code.  

- Keep naming consistent: `User`, `Expense`, `Transaction`, `Dashboard`, `Socket`  
- Follow separation between `spendsync` (frontend) and `server/src/` (backend)  
- Maintain secure practices: JWT, bcrypt, express-validator  
- Use Tailwind CSS conventions for frontend components  
- Respect project goals, architecture, and data flow described above
