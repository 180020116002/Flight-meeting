# Flyby ✈️

> Never get blindsided by a meeting again.

Flyby flies a little airplane across your screen 5 minutes before every meeting. Lives in your menu bar. Connects to Google Calendar. That's it.

---

## Repo structure

```
flyby/
├── app/        ← Electron desktop app (macOS + Windows)
└── landing/    ← Next.js 14 marketing site
```

This is an npm workspaces monorepo. Run `npm install` once at the root to install dependencies for both workspaces.

---

## Prerequisites

- **Node.js** ≥ 20
- A **Google Cloud Console project** with the Google Calendar API enabled
- An **OAuth 2.0 Client ID** of type **Desktop app**
  - Go to: https://console.cloud.google.com/apis/credentials
  - Add authorized redirect URI: `http://localhost:42813/oauth/callback`

---

## Setup

```bash
# 1. Clone and install
git clone https://github.com/your-username/flyby
cd flyby
npm install

# 2. Set Google OAuth credentials (app workspace)
cp app/.env.example app/.env
# Edit app/.env and fill in GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

# 3. Add tray icon assets (required for the tray to show)
# Place these files in app/resources/:
#   tray-icon.png        (16x16, black/white for macOS template; full-color for Windows)
#   tray-icon@2x.png     (32x32)
# Place app icon in app/build/:
#   icon.icns            (macOS app icon)
#   icon.ico             (Windows app icon)
```

---

## Development

```bash
# Run the Electron app in dev mode (hot reload)
npm run dev:app

# Run the landing page in dev mode
npm run dev:landing
```

The Electron app opens at `localhost:5173` (Vite renderer). The landing page opens at `localhost:3000`.

---

## Building for distribution

```bash
# macOS — produces Flyby-1.0.0.dmg + Flyby-1.0.0-mac.zip
npm run build:app:mac

# Windows — produces "Flyby Setup 1.0.0.exe"
npm run build:app:win

# Landing page
npm run build:landing
```

Build output for the app lands in `app/release/`. Landing build output is in `landing/.next/`.

### Code signing

Code signing stubs are in `app/electron-builder.yml`. To sign:

- **macOS**: Set `CSC_LINK` (path to .p12 certificate) and `CSC_KEY_PASSWORD` env vars before running `build:mac`. Notarization requires `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, and `APPLE_TEAM_ID`.
- **Windows**: Set `CSC_LINK` (path to .pfx file) and `CSC_KEY_PASSWORD`. Without signing, Windows SmartScreen will warn users on first run.

---

## Landing page deployment (Netlify)

1. Push the repo to GitHub
2. In Netlify: **Add new site → Import an existing project**
3. Set **Base directory** to `landing`
4. Netlify auto-detects the `netlify.toml` — build command and publish dir are pre-filled
5. Add environment variables in **Site settings → Environment variables**

Preview deployments are created automatically for every PR.

### Environment variables (landing)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_DOWNLOAD_MAC` | Mac installer download URL |
| `NEXT_PUBLIC_DOWNLOAD_WIN` | Windows installer download URL |

Or to deploy from the CLI:

```bash
cd landing
cp .env.example .env.local   # fill in download URLs
npm install -g netlify-cli
netlify deploy --prod
```

---

## Architecture overview

### Electron app

| Layer | Technology |
|---|---|
| Main process | TypeScript (compiled to CJS via electron-vite) |
| Renderer process | React 18 + TypeScript (ESM + Vite) |
| Styling | Tailwind CSS |
| Build | electron-vite + electron-builder |
| Auth | Google OAuth 2.0 (loopback redirect, port 42813) |
| Token storage | `app.safeStorage` (OS keychain) + electron-store |
| Calendar | Google Calendar API v3 via `googleapis` |
| Updates | electron-updater → GitHub Releases (stub) |

### Multi-window architecture

The app has three windows:
- **Overlay** — transparent, always-on-top, click-through. Renders the airplane animation. Triggered by the scheduler.
- **Settings** — frameless window with custom title bar. Opened from the tray menu.
- **Tray** — native `Tray` in main process. No BrowserWindow.

Windows communicate via IPC (contextBridge). The preload script (`electron/preload.ts`) is the only bridge between renderer and main process.

### Google Calendar polling

The scheduler polls every 60 seconds. For each upcoming event, it sets a `setTimeout` at `startTime - leadMinutes`. On `powerMonitor.resume`, it re-polls immediately to catch events that may have fired during sleep.

---

## Google Cloud Console setup

1. Create a project at https://console.cloud.google.com
2. Enable **Google Calendar API**
3. Go to **Credentials → Create Credentials → OAuth 2.0 Client ID**
4. Application type: **Desktop app**
5. Add redirect URI: `http://localhost:42813/oauth/callback`
6. Download the JSON and extract `client_id` and `client_secret`
7. Add them to `app/.env`

---

## Contributing

PRs welcome. For major changes, open an issue first.

---

*Free · Open Source · Made with 🩷 in Mumbai*
