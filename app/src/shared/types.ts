// ─── Settings ─────────────────────────────────────────────────────────────────

export interface Settings {
  notifyMinutesBefore: number
  selectedCalendars: string[]
  airplaneColor: string
  animationSpeed: 'slow' | 'normal' | 'fast'
  showAllDay: boolean
  onlyWithAttendees: boolean
  soundEnabled: boolean
  launchAtLogin: boolean
}

// ─── Meeting Alert ────────────────────────────────────────────────────────────

export interface MeetingAlert {
  id: string
  title: string
  startTime: string   // ISO 8601 string
  endTime: string     // ISO 8601 string
  meetLink?: string
  attendeeCount: number
  attendees: string[]
  calendarId: string
  minutesUntilStart: number
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

export interface CalendarEvent {
  id: string
  title: string
  startTime: string   // ISO string (serializable)
  endTime: string     // ISO string (serializable)
  meetLink?: string
  attendeeCount: number
  attendees: string[]
  calendarId: string
  isAllDay: boolean
}

export interface CalendarInfo {
  id: string
  name: string
  color: string
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthStatus {
  authenticated: boolean
  email?: string
}

// ─── Window ───────────────────────────────────────────────────────────────────

export type WindowMode = 'overlay' | 'settings'

// ─── Electron API ─────────────────────────────────────────────────────────────

export interface ElectronAPI {
  auth: {
    startOAuth: () => Promise<void>
    signOut: () => Promise<void>
    getStatus: () => Promise<AuthStatus>
  }
  calendar: {
    getCalendars: () => Promise<CalendarInfo[]>
  }
  settings: {
    get: () => Promise<Settings>
    save: (settings: Partial<Settings>) => Promise<void>
  }
  overlay: {
    dismiss: () => void
    setIgnoreMouse: (ignore: boolean) => void
  }
  window: {
    closeSettings: () => void
    minimizeSettings: () => void
    openSettings: () => void
  }
  onMeetingAlert: (callback: (payload: MeetingAlert) => void) => () => void
  onAuthChanged: (callback: (status: AuthStatus) => void) => () => void
  onSettingsChanged: (callback: (settings: Settings) => void) => () => void
  testAnimation: (callback: (payload: MeetingAlert) => void) => () => void
  triggerTest: () => void
}

// ─── Global augmentation ─────────────────────────────────────────────────────

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
