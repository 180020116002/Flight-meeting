import {
  app,
  BrowserWindow,
  Tray,
  Menu,
  ipcMain,
  screen,
  shell,
  nativeImage
} from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import Store from 'electron-store'
import {
  startOAuthFlow,
  signOut,
  isAuthenticated,
  getValidClient
} from './google-auth'
import { CalendarService } from './calendar'
import { MeetingScheduler, MeetingAlertPayload, SchedulerSettings } from './scheduler'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppSettings {
  notifyMinutesBefore: number
  selectedCalendars: string[]
  airplaneColor: string
  animationSpeed: 'slow' | 'normal' | 'fast'
  showAllDay: boolean
  onlyWithAttendees: boolean
  soundEnabled: boolean
  launchAtLogin: boolean
}

interface StoreSchema {
  settings: AppSettings
}

// ─── Default Settings ─────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: AppSettings = {
  notifyMinutesBefore: 5,
  selectedCalendars: [],
  airplaneColor: '#FFB6C1',
  animationSpeed: 'normal',
  showAllDay: false,
  onlyWithAttendees: false,
  soundEnabled: true,
  launchAtLogin: false
}

// ─── Globals ──────────────────────────────────────────────────────────────────

const store = new Store<StoreSchema>({ name: 'flyby-settings' })
const calendarService = new CalendarService()
let overlayWindow: BrowserWindow | null = null
let settingsWindow: BrowserWindow | null = null
let tray: Tray | null = null
let scheduler: MeetingScheduler | null = null
let nextMeetingInfo: string = 'No upcoming meetings'
let winAlwaysOnTopTimer: NodeJS.Timeout | null = null

// ─── Settings Helpers ─────────────────────────────────────────────────────────

function getSettings(): AppSettings {
  return store.get('settings', DEFAULT_SETTINGS) as AppSettings
}

function saveSettings(partial: Partial<AppSettings>): void {
  const current = getSettings()
  const updated = { ...current, ...partial }
  store.set('settings', updated)
}

// ─── Window Creation ──────────────────────────────────────────────────────────

function createOverlayWindow(): BrowserWindow {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  const win = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  win.setIgnoreMouseEvents(true, { forward: true })
  win.setAlwaysOnTop(true, 'screen-saver')

  if (process.platform === 'darwin') {
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
    win.setWindowButtonVisibility(false)
  }

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  } else {
    win.loadURL('http://localhost:5173')
  }

  return win
}

function createSettingsWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 680,
    minHeight: 500,
    show: false,
    frame: false,
    transparent: false,
    backgroundColor: '#ffffff',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  if (process.platform === 'darwin') {
    win.setWindowButtonVisibility(true)
  }

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../renderer/settings.html'))
  } else {
    win.loadURL('http://localhost:5173/settings.html')
  }

  win.on('close', (e) => {
    // Hide instead of destroy on macOS
    if (process.platform === 'darwin') {
      e.preventDefault()
      win.hide()
    }
  })

  win.on('ready-to-show', () => {
    // Don't auto-show; settings is opened via tray
  })

  return win
}

// ─── Tray Setup ───────────────────────────────────────────────────────────────

function buildTrayMenu(): Menu {
  return Menu.buildFromTemplate([
    {
      label: nextMeetingInfo,
      enabled: false
    },
    { type: 'separator' },
    {
      label: 'Open Settings',
      click: () => openSettings()
    },
    {
      label: 'Test Flyby Animation',
      click: () => triggerTestAnimation()
    },
    { type: 'separator' },
    {
      label: 'Quit Flyby',
      click: () => {
        app.exit(0)
      }
    }
  ])
}

function createTray(): Tray {
  let trayIcon: Electron.NativeImage

  const iconPath = path.join(app.getAppPath(), 'resources', 'tray-icon.png')
  if (fs.existsSync(iconPath)) {
    trayIcon = nativeImage.createFromPath(iconPath)
    if (process.platform === 'darwin') {
      trayIcon = trayIcon.resize({ width: 16, height: 16 })
      trayIcon.setTemplateImage(true)
    }
  } else {
    // Fallback: 1x1 transparent PNG
    trayIcon = nativeImage.createFromDataURL(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    )
  }

  const t = new Tray(trayIcon)
  t.setToolTip('Flyby')
  t.setContextMenu(buildTrayMenu())

  t.on('double-click', () => {
    openSettings()
  })

  return t
}

function refreshTrayMenu(): void {
  if (tray) {
    tray.setContextMenu(buildTrayMenu())
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function openSettings(): void {
  if (!settingsWindow) return
  if (!settingsWindow.isVisible()) {
    settingsWindow.show()
  }
  settingsWindow.focus()
}

function triggerTestAnimation(): void {
  if (!overlayWindow) return
  const testPayload: MeetingAlertPayload = {
    id: 'test-meeting',
    title: 'Team Standup',
    startTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
    meetLink: 'https://meet.google.com/abc-defg-hij',
    attendeeCount: 4,
    attendees: ['alice@example.com', 'bob@example.com'],
    calendarId: 'primary',
    minutesUntilStart: 5
  }
  overlayWindow.webContents.send('meeting-alert', testPayload)
}

function updateNextMeetingInfo(payload: MeetingAlertPayload): void {
  const time = new Date(payload.startTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
  nextMeetingInfo =
    payload.minutesUntilStart === 0
      ? `${payload.title} — now`
      : `${payload.title} — in ${payload.minutesUntilStart}min (${time})`
  refreshTrayMenu()
}

// ─── IPC Handlers ─────────────────────────────────────────────────────────────

function registerIpcHandlers(): void {
  // Auth
  ipcMain.handle('auth:startOAuth', async () => {
    await startOAuthFlow()
    const authenticated = isAuthenticated()
    const status = { authenticated }
    overlayWindow?.webContents.send('auth:changed', status)
    settingsWindow?.webContents.send('auth:changed', status)

    if (authenticated && scheduler) {
      scheduler.poll()
    }
  })

  ipcMain.handle('auth:signOut', async () => {
    signOut()
    scheduler?.stop()
    const status = { authenticated: false }
    overlayWindow?.webContents.send('auth:changed', status)
    settingsWindow?.webContents.send('auth:changed', status)
  })

  ipcMain.handle('auth:getStatus', async () => {
    if (!isAuthenticated()) return { authenticated: false }
    try {
      const client = await getValidClient()
      if (!client) return { authenticated: false }

      const { google } = await import('googleapis')
      const oauth2 = google.oauth2({ version: 'v2', auth: client })
      const info = await oauth2.userinfo.get()
      return { authenticated: true, email: info.data.email ?? undefined }
    } catch {
      return { authenticated: true }
    }
  })

  // Calendar
  ipcMain.handle('calendar:getCalendars', async () => {
    return calendarService.getCalendarList()
  })

  // Settings
  ipcMain.handle('settings:get', () => {
    return getSettings()
  })

  ipcMain.handle('settings:save', (_event, partial: Partial<AppSettings>) => {
    saveSettings(partial)
    const updated = getSettings()

    // Update login at startup
    if (partial.launchAtLogin !== undefined) {
      app.setLoginItemSettings({ openAtLogin: partial.launchAtLogin })
    }

    // Propagate to renderer(s)
    overlayWindow?.webContents.send('settings:changed', updated)
    settingsWindow?.webContents.send('settings:changed', updated)

    // Update scheduler settings
    if (scheduler) {
      const schedulerSettings: SchedulerSettings = {
        selectedCalendars: updated.selectedCalendars,
        leadMinutes: updated.notifyMinutesBefore,
        showAllDay: updated.showAllDay,
        onlyWithAttendees: updated.onlyWithAttendees
      }
      scheduler.updateSettings(schedulerSettings)
    }
  })

  // Overlay
  ipcMain.on('overlay:dismiss', () => {
    overlayWindow?.setIgnoreMouseEvents(true, { forward: true })
  })

  ipcMain.on('overlay:setIgnoreMouse', (_event, ignore: boolean) => {
    if (!overlayWindow) return
    if (ignore) {
      overlayWindow.setIgnoreMouseEvents(true, { forward: true })
    } else {
      overlayWindow.setIgnoreMouseEvents(false)
    }
  })

  // Window management
  ipcMain.on('window:closeSettings', () => {
    if (process.platform === 'darwin') {
      settingsWindow?.hide()
    } else {
      settingsWindow?.hide()
    }
  })

  ipcMain.on('window:minimizeSettings', () => {
    settingsWindow?.minimize()
  })

  ipcMain.on('window:openSettings', () => {
    openSettings()
  })

  // Test animation (from settings page)
  ipcMain.on('test:animation', () => {
    triggerTestAnimation()
  })
}

// ─── Scheduler Setup ──────────────────────────────────────────────────────────

function setupScheduler(): void {
  const settings = getSettings()
  const schedulerSettings: SchedulerSettings = {
    selectedCalendars: settings.selectedCalendars,
    leadMinutes: settings.notifyMinutesBefore,
    showAllDay: settings.showAllDay,
    onlyWithAttendees: settings.onlyWithAttendees
  }

  scheduler = new MeetingScheduler(calendarService, schedulerSettings)

  scheduler.on('meeting-alert', (payload: MeetingAlertPayload) => {
    updateNextMeetingInfo(payload)
    if (overlayWindow) {
      overlayWindow.setIgnoreMouseEvents(true, { forward: true })
      overlayWindow.webContents.send('meeting-alert', payload)
    }
  })

  if (isAuthenticated()) {
    scheduler.start()
  }
}

// ─── Windows-specific alwaysOnTop fix ────────────────────────────────────────

function startWindowsAlwaysOnTopInterval(): void {
  if (process.platform !== 'win32') return
  winAlwaysOnTopTimer = setInterval(() => {
    if (overlayWindow && !overlayWindow.isDestroyed()) {
      overlayWindow.setAlwaysOnTop(true, 'screen-saver')
    }
  }, 250)
}

// ─── App Lifecycle ────────────────────────────────────────────────────────────

app.on('ready', async () => {
  // Prevent Electron from showing in macOS dock
  if (process.platform === 'darwin') {
    app.dock?.hide()
  }

  registerIpcHandlers()

  overlayWindow = createOverlayWindow()
  settingsWindow = createSettingsWindow()
  tray = createTray()

  setupScheduler()
  startWindowsAlwaysOnTopInterval()

  // Open settings on first launch (no auth)
  if (!isAuthenticated()) {
    // Wait for settings window to finish loading
    settingsWindow.webContents.once('did-finish-load', () => {
      settingsWindow?.show()
    })
  }
})

app.on('window-all-closed', () => {
  // On macOS, keep running unless explicitly quit
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  openSettings()
})

app.on('before-quit', () => {
  scheduler?.stop()

  if (winAlwaysOnTopTimer) {
    clearInterval(winAlwaysOnTopTimer)
    winAlwaysOnTopTimer = null
  }

  // Allow windows to close during quit
  if (settingsWindow) {
    settingsWindow.removeAllListeners('close')
  }
})

// Handle second-instance (single instance lock)
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    openSettings()
  })
}

// Security: prevent navigation to external URLs
app.on('web-contents-created', (_event, contents) => {
  contents.on('will-navigate', (e, url) => {
    if (!url.startsWith('http://localhost') && !url.startsWith('file://')) {
      e.preventDefault()
    }
  })

  contents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      shell.openExternal(url)
    }
    return { action: 'deny' }
  })
})
