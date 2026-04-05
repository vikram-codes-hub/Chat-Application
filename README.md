# Chat-Application
<div align="center">

<img src="https://img.shields.io/badge/PulseChat-Real--Time%20Messaging-7c6eff?style=for-the-badge&logo=socket.io&logoColor=white" alt="PulseChat" />

# 💬 PulseChat

### Real-time chat — fast, sleek, and built for teams.

[![Status](https://img.shields.io/badge/Status-Coming%20Soon-orange?style=flat-square)](https://pulsechat.app)
[![Node](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=flat-square&logo=socket.io)](https://socket.io)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

<br />

> 🚧 **Live Demo:** [pulsechat.app](https://pulsechat.app) — **Coming Soon**

<br />

</div>

---

## 🌟 Overview

**PulseChat** is a full-stack real-time chat application built with **Socket.io**, **Node.js**, **React**, and **MongoDB**. It features instant messaging, live typing indicators, online presence, read receipts, profile management, and group rooms — all wrapped in a sleek dark-themed UI with smooth Framer Motion animations.

---

## ✨ Features

### 🔌 Real-Time Core (Socket.io)
- ⚡ **Instant messaging** — messages delivered without page refresh
- ✍️ **Live typing indicators** — "User is typing..." in real time
- 🟢 **Online / Offline presence** — see who's currently active
- ✅ **Read receipts** — know when your message has been seen
- 🔔 **Real-time notifications** — instant alerts for new messages

### 💬 Chat
- 👤 **One-on-One (Private) Chat** — direct messaging between users
- 👥 **Group Rooms** — create or join chat rooms
- 📜 **Message history** — previous conversations loaded on login
- 🖼️ **Media sharing** — send images, files, and emojis
- ✏️ **Edit & Delete messages** — full message management
- 🕐 **Timestamps** on every message

### 👤 Profile
- 📸 **Profile picture** — upload and update your avatar (Cloudinary)
- 🪪 **Display name & bio** — personalize your identity
- 💬 **Status message** — set custom status (e.g., "Busy", "Available")
- 👁️ **View other profiles** — click any user to see their info

### 🔐 Auth & Security
- 📧 **Registration & Login** — email/password
- 🔑 **JWT-based sessions** — secure token authentication
- 🛡️ **Protected routes** — authenticated access only
- 🔒 **Password hashing** — bcrypt

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Real-time | Socket.io |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| File Storage | Cloudinary |
| Dev Tools | Nodemon, ESLint |

---

## 🎨 Design System

PulseChat uses a custom **dark theme** with purple accents and fluid motion:

| Token | Value | Usage |
|---|---|---|
| Background (deep) | `#0f0f13` | Root background |
| Background (sidebar) | `#13131a` | Sidebar panel |
| Background (header) | `#11111a` | Header & input bar |
| Accent | `#7c6eff` | Buttons, active states, outgoing messages |
| Incoming bubble | `#1a1a28` | Received messages |

**Motion highlights:** messages slide in with fade, typing dots bounce in sequence, online indicator pulses, and the send button scales on hover.

---

## 📁 Project Structure

```
pulsechat/
├── pulsechat-server/           # Node.js + Express backend
│   ├── config/                 # DB connection, Cloudinary setup
│   ├── controllers/            # Auth, chat, room, user logic
│   ├── middleware/             # Auth guard, error handler, multer
│   ├── models/                 # Mongoose schemas (User, Message, Room)
│   ├── routes/                 # REST API routes
│   ├── sockets/                # Socket.io event handlers
│   │   ├── index.socket.js     # Socket registry
│   │   ├── chat.socket.js      # Messaging & read receipts
│   │   ├── presence.socket.js  # Online/offline tracking
│   │   └── room.socket.js      # Room join/leave events
│   ├── utils/                  # JWT helpers, response utils
│   └── index.js                # App entry point
│
└── pulsechat-client/           # React + Vite frontend
    └── src/
        ├── pages/              # Login, Register, Chat, Profile
        ├── components/
        │   ├── chat/           # MessageList, MessageInput, etc.
        │   ├── sidebar/        # UserList, RoomList
        │   ├── profile/        # ProfileCard, EditProfile
        │   └── common/         # Avatar, Badge, Modal
        ├── context/            # SocketContext, AuthContext
        ├── hooks/              # useSocket, useAuth, useMessages
        ├── services/           # Axios API calls
        └── socket.js           # Socket.io client init
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/pulsechat.git
cd pulsechat
```

### 2. Set up the backend

```bash
cd pulsechat-server
npm install
```

Create a `.env` file in `pulsechat-server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### 3. Set up the frontend

```bash
cd ../pulsechat-client
npm install
```

Create a `.env` file in `pulsechat-client/`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Run the app

**Backend:**
```bash
cd pulsechat-server
npm run dev
```

**Frontend (new terminal):**
```bash
cd pulsechat-client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. 🎉

---

## 🌐 Deployment

> 🚧 **Live app coming soon at [pulsechat.app](https://pulsechat.app)**

Recommended deployment targets:

| Service | Purpose |
|---|---|
| [Render](https://render.com) | Backend (Node + Socket.io) |
| [Vercel](https://vercel.com) | Frontend (React + Vite) |
| [MongoDB Atlas](https://cloud.mongodb.com) | Database |
| [Cloudinary](https://cloudinary.com) | Media storage |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/cool-feature`
3. Commit your changes: `git commit -m 'Add cool feature'`
4. Push to the branch: `git push origin feature/cool-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ using **Socket.io**, **React**, and **Node.js**

⭐ Star this repo if you find it useful!

</div>