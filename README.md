# ZillGO — Global Virtual & Live Tour Platform

![ZillGO](https://img.shields.io/badge/ZillGO-Live%20Tours-6C63FF?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Ready-336791?style=for-the-badge&logo=postgresql)

ZillGO is a full-stack platform that connects travelers with local guides for immersive live virtual tours worldwide.

## 🌐 Live Demo

- **Frontend:** Deployed on Netlify
- **Backend API:** Deployed on Render.com

## ✨ Features

- 🗺️ **Explore Tours** — Browse 100+ tours globally by category, location, price
- 🎥 **Live Virtual Tours** — Real-time streaming with Socket.io
- 👤 **Guide Profiles** — Verified local guides with ratings
- 📅 **Smart Booking** — Multi-step booking with Stripe payments
- 💬 **Real-time Messaging** — Chat with guides before booking
- 🏆 **Leaderboard** — Top guides and traveler rewards
- 🛒 **Marketplace** — Buy local souvenirs from guides
- 🗓️ **Trip Planner** — AI-assisted multi-day itinerary builder
- 🔐 **Social Auth** — Google, GitHub, Facebook login
- 👑 **Admin Panel** — Full user/tour management dashboard
- 🌍 **Multi-language** — i18n support (English + more)

## 🚀 Quick Start (Local)

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/zillgo.git
cd zillgo

# 2. Install all dependencies
npm install
cd server && npm install && cd ..

# 3. Configure environment variables
cp server/.env.example server/.env
# Edit server/.env with your values

# 4. Start both servers
# Terminal 1 — Backend
cd server && node index.js

# Terminal 2 — Frontend
npm run dev
\`\`\`

Open **http://localhost:3001** in your browser.



## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router |
| Backend | Node.js, Express 5, Socket.io |
| Database | PostgreSQL (with demo fallback) |
| Payments | Stripe |
| Media | Cloudinary |
| Auth | JWT + OAuth (Google, GitHub, Facebook) |
| Deployment | Netlify (FE) + Render (BE) |

## 🌐 Deploy to Production

### Option A: Netlify + Render (Recommended — Free)

1. Push code to GitHub
2. **Backend on Render:** New → Web Service → select repo → Root Dir: `server`
3. **Frontend on Netlify:** New → Import from GitHub → Build: `npm run build` → Publish: `dist`
4. Set `VITE_API_URL` in Netlify env to your Render URL

### Option B: Single Server (Render only)

Build command: `npm install && npm run build && cd server && npm install`
Start command: `NODE_ENV=production node server/index.js`

## 📄 License

MIT © 2026 ZillGO
