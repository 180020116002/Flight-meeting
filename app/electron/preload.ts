import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

// Re-export types that the renderer needs (compiled away at runtime)
export type AuthStatus = {
  authenticated: boolean
  email?: string
}

export type CalendarInfo = {
  id: string
  name: string
  color: string
}

export type MeetingAlertPayload = {
  id: string
  title: string
  startTime: string
  endTime: string
  meetLink?: string
  attendeeCount: number
  attendees: string[]
  calendarId: string
  minutesUntilStart: number
}

export type AppSettings = {
  notifyMinutesBefore: number
  selectedCalendars: string[]
  airplaneColor: string
  animationSpeed: 'slow' | 'normal' | 'fast'
  showAllDay: boolean
  onlyWithAttendees: boolean
  soundEnabled: boolean
  launchAtLogin: boolean
}

const api = {
  auth: {
    startOAuth: (): Promise<void> =>
      ipcRenderer.invoke('auth:startOAuth'),
    signOut: (): Promise<void> =>
      ipcRenderer.invoke('auth:signOut'),
    getStatus: (): Promise<AuthStatus> =>
      ipcRenderer.invoke('auth:getStatus')
  },

  calendar: {
    getCalendars: (): Promise<CalendarInfo[]> =>
      ipcRenderer.invoke('calendar:getCalendars')
  },

  settings: {
    get: (): Promise<AppSettings> =>
      ipcRenderer.invoke('settings:get'),
    save: (settings: Partial<AppSettings>): Promise<void> =>
      ipcRenderer.invoke('settings:save', settings)
  },

  overlay: {
    dismiss: (): void => {
      ipcRenderer.send('overlay:dismiss')
    },
    setIgnoreMouse: (ignore: boolean): void => {
      ipcRenderer.send('overlay:setIgnoreMouse', ignore)
    }
  },

  window: {
    closeSettings: (): void => {
      ipcRenderer.send('window:closeSettings')
    },
    minimizeSettings: (): void => {
      ipcRenderer.send('window:minimizeSettings')
    },
    openSettings: (): void => {
      ipcRenderer.send('window:openSettings')
    }
  },

  onMeetingAlert: (
    callback: (payload: MeetingAlertPayload) => void
  ): (() => void) => {
    const handler = (_event: IpcRendererEvent, payload: MeetingAlertPayload) => {
      callback(payload)
    }
    ipcRenderer.on('meeting-alert', handler)
    return () => {
      ipcRenderer.removeListener('meeting-alert', handler)
    }
  },

  onAuthChanged: (
    callback: (status: AuthStatus) => void
  ): (() => void) => {
    const handler = (_event: IpcRendererEvent, status: AuthStatus) => {
      callback(status)
    }
    ipcRenderer.on('auth:changed', handler)
    return () => {
      ipcRenderer.removeListener('auth:changed', handler)
    }
  },

  onSettingsChanged: (
    callback: (settings: AppSettings) => void
  ): (() => void) => {
    const handler = (_event: IpcRendererEvent, settings: AppSettings) => {
      callback(settings)
    }
    ipcRenderer.on('settings:changed', handler)
    return () => {
      ipcRenderer.removeListener('settings:changed', handler)
    }
  },

  testAnimation: (callback: (payload: MeetingAlertPayload) => void): (() => void) => {
    const handler = (_event: IpcRendererEvent, payload: MeetingAlertPayload) => {
      callback(payload)
    }
    ipcRenderer.on('test:animation', handler)
    return () => {
      ipcRenderer.removeListener('test:animation', handler)
    }
  },

  triggerTest: (): void => {
    ipcRenderer.send('test:animation')
  }
}

contextBridge.exposeInMainWorld('electronAPI', api)

// TypeScript global type augmentation — used in renderer only
declare global {
  interface Window {
    electronAPI: typeof api
  }
}
