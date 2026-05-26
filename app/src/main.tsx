import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import { OverlayApp } from './overlay/OverlayApp'
import { SettingsApp } from './settings/SettingsApp'
import type { WindowMode } from './shared/types'

function detectWindowMode(): WindowMode {
  // Check the HTML file being served (settings.html sets ?window=settings in the script src)
  // In production, the pathname of the HTML file differs.
  // In dev, settings is served at /settings.html.
  const pathname = window.location.pathname
  const search = window.location.search

  if (
    pathname.includes('settings') ||
    search.includes('window=settings') ||
    document.title.toLowerCase().includes('settings')
  ) {
    return 'settings'
  }

  return 'overlay'
}

const mode = detectWindowMode()
const rootEl = document.getElementById('root')!

const root = ReactDOM.createRoot(rootEl)
root.render(
  <React.StrictMode>
    {mode === 'settings' ? <SettingsApp /> : <OverlayApp />}
  </React.StrictMode>
)
