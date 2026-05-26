import { EventEmitter } from 'events'
import { powerMonitor } from 'electron'
import { CalendarService, CalendarEvent } from './calendar'

export interface SchedulerSettings {
  selectedCalendars: string[]
  leadMinutes: number
  showAllDay: boolean
  onlyWithAttendees: boolean
}

export interface MeetingAlertPayload {
  id: string
  title: string
  startTime: string // ISO string
  endTime: string   // ISO string
  meetLink?: string
  attendeeCount: number
  attendees: string[]
  calendarId: string
  minutesUntilStart: number
}

export declare interface MeetingScheduler {
  on(event: 'meeting-alert', listener: (payload: MeetingAlertPayload) => void): this
  emit(event: 'meeting-alert', payload: MeetingAlertPayload): boolean
}

export class MeetingScheduler extends EventEmitter {
  private calendarService: CalendarService
  private settings: SchedulerSettings
  private pollTimer: NodeJS.Timeout | null = null
  private pendingAlerts: Map<string, NodeJS.Timeout> = new Map()
  private lastPollTime: Date | null = null
  private isRunning = false
  private readonly POLL_INTERVAL_MS = 60_000

  constructor(calendarService: CalendarService, settings: SchedulerSettings) {
    super()
    this.calendarService = calendarService
    this.settings = settings
  }

  updateSettings(settings: Partial<SchedulerSettings>): void {
    this.settings = { ...this.settings, ...settings }
    if (this.isRunning) {
      this.clearAllAlerts()
      this.poll().catch(console.error)
    }
  }

  start(): void {
    if (this.isRunning) return
    this.isRunning = true

    this.poll().catch(console.error)
    this.pollTimer = setInterval(() => {
      this.poll().catch(console.error)
    }, this.POLL_INTERVAL_MS)

    powerMonitor.on('resume', this.onSystemResume)
    console.log('[Scheduler] Started')
  }

  stop(): void {
    if (!this.isRunning) return
    this.isRunning = false

    if (this.pollTimer) {
      clearInterval(this.pollTimer)
      this.pollTimer = null
    }

    this.clearAllAlerts()
    powerMonitor.off('resume', this.onSystemResume)
    console.log('[Scheduler] Stopped')
  }

  private onSystemResume = () => {
    console.log('[Scheduler] System resumed from sleep, re-polling...')
    this.clearAllAlerts()
    this.poll().catch(console.error)
  }

  private clearAllAlerts(): void {
    for (const [, timer] of this.pendingAlerts) {
      clearTimeout(timer)
    }
    this.pendingAlerts.clear()
  }

  async poll(): Promise<void> {
    this.lastPollTime = new Date()

    try {
      const events = await this.calendarService.getUpcomingEvents(
        24,
        this.settings.selectedCalendars.length > 0
          ? this.settings.selectedCalendars
          : undefined
      )

      const filtered = this.filterEvents(events)
      this.scheduleAlerts(filtered)
    } catch (err) {
      console.error('[Scheduler] Poll failed:', err)
    }
  }

  private filterEvents(events: CalendarEvent[]): CalendarEvent[] {
    return events.filter((event) => {
      if (event.isAllDay && !this.settings.showAllDay) return false
      if (this.settings.onlyWithAttendees && event.attendeeCount < 2) return false
      if (
        this.settings.selectedCalendars.length > 0 &&
        !this.settings.selectedCalendars.includes(event.calendarId)
      ) {
        return false
      }
      return true
    })
  }

  private scheduleAlerts(events: CalendarEvent[]): void {
    const now = Date.now()
    const leadMs = this.settings.leadMinutes * 60 * 1000

    for (const event of events) {
      const triggerTime = event.startTime.getTime() - leadMs

      // Skip events that already have a pending alert
      if (this.pendingAlerts.has(event.id)) continue

      // Skip events where the trigger time has already passed
      if (triggerTime <= now) {
        // If we missed it during sleep and start time is still in the future, alert now
        if (event.startTime.getTime() > now) {
          this.fireAlert(event)
        }
        continue
      }

      const delay = triggerTime - now
      const timer = setTimeout(() => {
        this.pendingAlerts.delete(event.id)
        this.fireAlert(event)
      }, delay)

      this.pendingAlerts.set(event.id, timer)
      console.log(
        `[Scheduler] Scheduled alert for "${event.title}" in ${Math.round(delay / 1000)}s`
      )
    }

    // Clean up alerts for events no longer in the list
    const eventIds = new Set(events.map((e) => e.id))
    for (const [id, timer] of this.pendingAlerts) {
      if (!eventIds.has(id)) {
        clearTimeout(timer)
        this.pendingAlerts.delete(id)
      }
    }
  }

  private fireAlert(event: CalendarEvent): void {
    const now = Date.now()
    const minutesUntilStart = Math.max(
      0,
      Math.round((event.startTime.getTime() - now) / 60_000)
    )

    const payload: MeetingAlertPayload = {
      id: event.id,
      title: event.title,
      startTime: event.startTime.toISOString(),
      endTime: event.endTime.toISOString(),
      meetLink: event.meetLink,
      attendeeCount: event.attendeeCount,
      attendees: event.attendees,
      calendarId: event.calendarId,
      minutesUntilStart
    }

    console.log(`[Scheduler] Firing alert: "${event.title}" starts in ${minutesUntilStart}min`)
    this.emit('meeting-alert', payload)
  }

  getLastPollTime(): Date | null {
    return this.lastPollTime
  }

  getPendingAlertCount(): number {
    return this.pendingAlerts.size
  }
}
