# MINE·TIME TODO 🖤❤️

> A neo-brutalist Progressive Web App for couples to manage tasks, share photos, and track progress together.

![Neo-Brutalism Design](https://img.shields.io/badge/Design-Neo_Brutalism-FF6B6B?style=for-the-badge&labelColor=1A1A2E)
![PWA Ready](https://img.shields.io/badge/PWA-Installable-FFD93D?style=for-the-badge&labelColor=1A1A2E)
![Vanilla JS](https://img.shields.io/badge/Built_With-Vanilla_JS-6BCB77?style=for-the-badge&labelColor=1A1A2E)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **📋 Task Management** | Create, edit, delete tasks with priority levels (`!` `!!` `!!!`) |
| **👫 Couple Mode** | Assign tasks as **MINE**, **YOURS**, or **OURS** with filter tabs |
| **📸 Photo Attachments** | Attach photos from camera or gallery with auto-compression |
| **📊 Progress Tracking** | Together Score, per-person breakdowns, streak counter |
| **🖼 Memories Wall** | Completed tasks become memories with photo grid + milestones |
| **📱 PWA** | Installable on Android, works offline, fullscreen like native |
| **🎨 Neo-Brutalism UI** | Warm cream palette, bold shadows, rounded corners, bouncy interactions |

---

## 🎨 Design System

**Neo-Brutalism** — warm, playful, and bold:

- **Palette**: Cream `#FEF5E7` background, warm accents (coral, yellow, green)
- **Typography**: JetBrains Mono (monospace)
- **Borders**: 2.5–3px solid dark outlines
- **Shadows**: Solid offset `5px 5px 0` (no blur)
- **Corners**: 8–20px border radius
- **Interactions**: Bouncy `cubic-bezier(0.34, 1.56, 0.64, 1)` spring animations
- **States**: Lift on hover, compress on press, rotate on interact

---

## Preview
![Preview](https://github.com/CodeByPrakash/Our-TODO/raw/main/ourtodo.png)
---
![Preview](https://github.com/CodeByPrakash/Our-TODO/raw/main/ourtodo-c.png)
---
![Preview](https://github.com/CodeByPrakash/Our-TODO/raw/main/ourtodo-ed.png)
---
![Preview](https://github.com/CodeByPrakash/Our-TODO/raw/main/ourtodo-ex.png)
---
![Preview](https://github.com/CodeByPrakash/Our-TODO/raw/main/ourtodo-stats.png)
---
## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- npm

### Install & Run

```bash
# Clone the repo
git clone https://github.com/yourusername/Mine-Time-TODO.git
cd Mine-Time-TODO

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [https://localhost:5173](https://localhost:5173) in your browser.

### Access on Phone (same WiFi)

```bash
# Start with network access
npx vite --host

# Open the Network URL on your phone's Chrome
# Example: https://192.168.x.x:5173
```

---

## 📱 Install on Android

1. Open the app URL in **Chrome** on your Android phone
2. Accept the self-signed certificate warning (Advanced → Proceed)
3. Use the app for ~30 seconds
4. Tap **⋮ menu → "Install app"** or **"Add to Home screen"**
5. Done! App appears on your home screen 🎉

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Bundler** | Vite 6.4 |
| **Language** | Vanilla JavaScript (ES Modules) |
| **Styling** | Vanilla CSS + Design Tokens |
| **Storage** | IndexedDB via `idb` |
| **PWA** | `vite-plugin-pwa` + `@vitejs/plugin-basic-ssl` |
| **Fonts** | JetBrains Mono (Google Fonts) |

---

## 📁 Project Structure

```
Mine-Time-TODO/
├── index.html                 # Entry point
├── package.json
├── vite.config.js             # Vite + PWA + SSL config
├── public/
│   ├── favicon.svg            # Brutalist MT logo
│   └── icons/                 # PWA icons (192px, 512px)
├── src/
│   ├── main.js                # App bootstrap
│   ├── app.js                 # Shell, routing, header
│   ├── db.js                  # IndexedDB CRUD + stats
│   ├── router.js              # Hash-based SPA router
│   ├── components/
│   │   ├── Modal.js           # Bottom sheet modal
│   │   ├── NavBar.js          # Bottom navigation (4 tabs)
│   │   ├── ProgressBar.js     # Animated progress bar
│   │   ├── TaskCard.js        # Task display card
│   │   └── TaskForm.js        # Add/edit task form
│   ├── pages/
│   │   ├── TasksPage.js       # Main task list + filters
│   │   ├── ProgressPage.js    # Stats dashboard
│   │   ├── MemoriesPage.js    # Completed tasks grid
│   │   └── SettingsPage.js    # Profiles + data management
│   ├── styles/
│   │   ├── reset.css          # CSS reset
│   │   ├── tokens.css         # Design tokens
│   │   ├── brutalist.css      # Component styles
│   │   └── animations.css     # Micro-animations
│   └── utils/
│       ├── date.js            # Date formatting
│       ├── id.js              # ID generator
│       └── photo.js           # Image compression
```

---

## 🛣 Roadmap

- [x] Task CRUD with priorities
- [x] Couple mode (MINE / YOURS / OURS)
- [x] Photo attachments with compression
- [x] Progress tracking & streaks
- [x] Memories wall with milestones
- [x] PWA (installable, offline)
- [x] Neo-brutalism UI redesign
- [ ] 🔥 Firebase real-time sync between devices
- [ ] Push notifications for due tasks
- [ ] Drag-to-reorder tasks
- [ ] Love notes / emoji reactions on completed tasks
- [ ] Deploy to Vercel/Netlify

---

## 🤝 For Us

Built with love for **ME** 🖤 and **BAE** ❤️

Customize your names in **Setup → Edit Profile**.

---

## 📄 License

MIT — do whatever you want with it.

---

<p align="center">
  <strong>MINE·TIME</strong> — Because every task is better together 💕
</p>
