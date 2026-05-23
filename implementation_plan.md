# Mine-Time TODO — Brutalist Couples Task App

A minimal brutalism-designed Progressive Web App (PWA) for couples to manage tasks, attach photos, and track progress together. Built for you and your girlfriend 💕

## Design Direction

![Brutalist Design Mockup](C:\Users\absol\.gemini\antigravity\brain\cc89dbef-923d-4322-9f17-5b85cabbbc06\brutalist_todo_mockup_1779536168615.png)

### Brutalism Design Principles
- **Monospace typography** — `JetBrains Mono` / `Space Mono` for that raw, coded feel
- **Stark palette** — `#000000` black, `#FFFFFF` white, `#FF2D2D` red accent
- **Thick 3px+ borders** — visible structure, no soft shadows or rounded corners
- **Exposed grid** — raw layout lines, functional hierarchy
- **No decoration** — every pixel serves a purpose
- **Micro-interactions** — sharp, snappy transitions (no easing curves)

---

## Core Features

### 1. **Task Management**
- Create, edit, delete tasks
- Assign to "Me" or "Us" (couple categories)
- Priority levels: `!!!` / `!!` / `!`
- Due dates with countdown
- Drag-to-reorder

### 2. **Photo Attachments**
- Attach photos to any task (camera or gallery)
- Photo preview in task cards
- Full-screen photo viewer
- Store as base64 in IndexedDB (offline-first)

### 3. **Progress Tracking**
- Visual progress bars per category
- Daily/weekly streak counter
- Completion percentage dashboard
- "Together Score" — shared completion metric

### 4. **Couple Mode**
- Two profiles: customizable names + avatars
- "Mine" / "Yours" / "Ours" task filters
- Shared task board
- Love notes on completed tasks (optional emoji reactions)

### 5. **Memories Wall**
- Completed tasks with photos become "memories"
- Timeline/grid view of accomplishments
- Milestone celebrations (10 tasks, 50 tasks, etc.)

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | Vite + Vanilla JS | Ultra-fast, zero bloat — fits brutalism |
| **Styling** | Vanilla CSS | Full control over raw aesthetics |
| **Storage** | IndexedDB (via idb) | Offline-first, handles photos/blobs |
| **PWA** | vite-plugin-pwa | Service worker, manifest, installable |
| **Icons** | Custom SVG | Brutalist monoline icons |
| **Fonts** | Google Fonts (JetBrains Mono) | Monospace brutalist typography |

> [!IMPORTANT]
> **Why PWA instead of native Android?** A PWA gives you an installable app on Android (home screen icon, fullscreen, offline) without needing Android Studio, Java/Kotlin, or Play Store. It works immediately and can be shared via URL. Perfect for a personal couples app.

---

## Proposed File Structure

```
Mine-Time-TODO/
├── index.html              # Entry point with PWA manifest link
├── sw.js                   # Service worker for offline
├── manifest.json           # PWA manifest (icons, theme, display)
├── vite.config.js          # Vite config with PWA plugin
├── package.json
│
├── public/
│   ├── icons/              # PWA icons (192px, 512px)
│   └── favicon.svg
│
├── src/
│   ├── main.js             # App entry point, router
│   ├── app.js              # Core app shell & navigation
│   ├── db.js               # IndexedDB wrapper (tasks, photos, profiles)
│   ├── router.js           # Simple hash-based router
│   │
│   ├── styles/
│   │   ├── reset.css       # CSS reset
│   │   ├── tokens.css      # Design tokens (colors, fonts, spacing)
│   │   ├── brutalist.css   # Core brutalist component styles
│   │   └── animations.css  # Sharp micro-animations
│   │
│   ├── components/
│   │   ├── TaskCard.js     # Individual task component
│   │   ├── TaskForm.js     # Add/edit task form
│   │   ├── PhotoPicker.js  # Camera/gallery photo selector
│   │   ├── ProgressBar.js  # Brutalist progress bar
│   │   ├── ProfileBadge.js # Couple avatar badges
│   │   ├── NavBar.js       # Bottom navigation
│   │   └── Modal.js        # Generic modal overlay
│   │
│   ├── pages/
│   │   ├── TasksPage.js    # Main task list (filtered views)
│   │   ├── ProgressPage.js # Progress dashboard
│   │   ├── MemoriesPage.js # Completed tasks with photos
│   │   └── SettingsPage.js # Profile setup, data export
│   │
│   └── utils/
│       ├── date.js         # Date formatting helpers
│       ├── id.js           # UUID generator
│       └── photo.js        # Image compression/resize
```

---

## Proposed Changes

### Phase 1: Foundation
#### [NEW] package.json
- Vite dev dependencies, PWA plugin, idb library

#### [NEW] vite.config.js
- PWA plugin config with manifest settings

#### [NEW] index.html
- Minimal HTML shell, font imports, manifest link, viewport meta

#### [NEW] src/styles/*.css
- Complete brutalist design system: tokens, reset, components, animations

---

### Phase 2: Core Engine
#### [NEW] src/db.js
- IndexedDB schema: `tasks`, `profiles`, `settings` stores
- CRUD operations for tasks with photo blob storage
- Profile management (two users)

#### [NEW] src/router.js
- Hash-based SPA router (#tasks, #progress, #memories, #settings)

#### [NEW] src/app.js
- App shell with navigation, page rendering

#### [NEW] src/main.js
- Bootstrap app, register service worker, init DB

---

### Phase 3: Components & Pages
#### [NEW] src/components/*.js
- All UI components: TaskCard, TaskForm, PhotoPicker, ProgressBar, ProfileBadge, NavBar, Modal

#### [NEW] src/pages/*.js
- All pages: TasksPage, ProgressPage, MemoriesPage, SettingsPage

---

### Phase 4: PWA & Polish
#### [NEW] manifest.json
- App name, icons, theme color (#000), background color (#000), display: standalone

#### [NEW] public/icons/*
- Generated PWA icons at 192px and 512px

#### [NEW] sw.js
- Cache-first strategy for assets, network-first for data

---

## Open Questions

> [!IMPORTANT]
> **Names & Avatars** — What names should I use for the two profiles? Should I use your actual names or generic placeholders like "Him" / "Her"?

> [!NOTE]
> **Color preference** — I'm going with black/white/red as the brutalist accent. Would you prefer a different accent color? (Options: red, yellow, electric blue, neon green)

> [!NOTE]
> **Data sync** — This version stores everything locally on each device (offline-first). If you want both phones to sync tasks, we'd need a backend (Firebase/Supabase). Should I keep it local-only for now?

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify production build
- Lighthouse PWA audit via browser DevTools
- Test offline functionality by disabling network in DevTools

### Manual Verification
- Browser testing on mobile viewport (390×844)
- Install PWA on Android Chrome
- Test photo capture from camera
- Verify IndexedDB persistence across sessions
- Test all CRUD operations for tasks
