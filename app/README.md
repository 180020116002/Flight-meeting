# Flyby — Desktop App

An Electron app that shows a gentle airplane flyby animation on your screen before each Google Calendar meeting.

## Prerequisites

- Node.js 20+
- A Google Cloud project with the Calendar API enabled
- OAuth 2.0 credentials (Desktop app type)

## Setup

### 1. Google OAuth Credentials

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create an OAuth 2.0 Client ID for a **Desktop app**
3. Add `http://localhost:42813/oauth/callback` as an authorized redirect URI
4. Download or copy the Client ID and Client Secret

### 2. Environment Variables

Set these before running:

```bash
export GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="your-client-secret"
```

Or create a `.env` file (not tracked by git) and load it before starting:

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 3. Tray Icon

Place a `tray-icon.png` file in `app/resources/`:
- Recommended size: 16×16 pixels (macOS template image) or 32×32 (Windows)
- macOS: Use a monochrome design; the image will be treated as a template image
- Windows: A full-color 32×32 PNG works best

You can generate one quickly using ImageMagick:

```bash
magick -size 32x32 xc:none -fill "#FFB6C1" -draw "text 4,24 '✈'" tray-icon.png
```

Or export from Figma/Canva.

### 4. Install & Run

```bash
# From the repo root
npm install

# Start in dev mode (hot-reload)
npm run dev:app

# Build for macOS (universal binary)
npm run build:app:mac

# Build for Windows
npm run build:app:win
```

## Code Signing (Production)

Before distributing:

- **macOS**: Obtain an Apple Developer ID certificate and fill in the `identity` and `notarize` fields in `electron-builder.yml`
- **Windows**: Obtain a code signing certificate and fill in `certificateFile` / `certificatePassword` in `electron-builder.yml`

## Auto-Update

The app is preconfigured to point at GitHub Releases. To enable:

1. Set `owner` and `repo` in `electron-builder.yml`
2. Add `electron-updater` as a dependency
3. Call `autoUpdater.checkForUpdatesAndNotify()` in `main.ts` after the app is ready

## Project Structure

```
app/
├── electron/          # Main process (Node.js / Electron)
│   ├── main.ts        # Entry point, window management, tray
│   ├── preload.ts     # contextBridge IPC bridge
│   ├── google-auth.ts # OAuth 2.0 flow
│   ├── calendar.ts    # Google Calendar API wrapper
│   └── scheduler.ts   # Meeting scheduling & alerts
├── src/               # Renderer (React + TypeScript)
│   ├── main.tsx       # Renderer entry — routes to overlay or settings
│   ├── overlay/       # Transparent overlay window components
│   ├── settings/      # Settings window component
│   ├── shared/        # Shared types
│   └── styles/        # Global CSS + Tailwind
├── resources/         # Static assets (tray-icon.png, etc.)
└── build/             # electron-builder assets (entitlements, icons)
```
