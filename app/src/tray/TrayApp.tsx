// The tray is managed entirely by the Electron main process (main.ts) using the
// native Tray API with a context menu. This file is a placeholder in case you
// later want to build a custom tray popover using a BrowserWindow.
//
// To use a BrowserWindow-based tray popup:
// 1. Create a small (e.g., 320x240) BrowserWindow in main.ts
// 2. Load this page into it (add a tray.html entry point like settings.html)
// 3. Toggle its visibility on tray click
// 4. Add `?window=tray` to the script src so main.tsx renders TrayApp

import React from 'react'

export function TrayApp() {
  return (
    <div
      style={{
        width: 320,
        fontFamily: 'system-ui, sans-serif',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        padding: 16,
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 24 }}>✈️</span>
        <span style={{ fontWeight: 700, fontSize: 16, color: '#2d1f27' }}>Flyby</span>
      </div>
      <p style={{ fontSize: 13, color: '#718096', margin: 0 }}>
        No upcoming meetings in the next 24 hours.
      </p>
    </div>
  )
}

export default TrayApp
