import { google, calendar_v3 } from 'googleapis'
import { getValidClient } from './google-auth'

export interface CalendarEvent {
  id: string
  title: string
  startTime: Date
  endTime: Date
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

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn()
    } catch (err: unknown) {
      lastError = err
      const isRateLimit =
        err instanceof Error &&
        (err.message.includes('429') || err.message.includes('rateLimitExceeded'))
      const delay = isRateLimit
        ? Math.pow(2, attempt) * 1000 + Math.random() * 500
        : Math.pow(2, attempt) * 500

      if (attempt < retries - 1) {
        console.warn(`[CalendarService] Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, err)
        await new Promise((r) => setTimeout(r, delay))
      }
    }
  }
  throw lastError
}

function extractMeetLink(event: calendar_v3.Schema$Event): string | undefined {
  if (event.hangoutLink) return event.hangoutLink

  const entryPoints = event.conferenceData?.entryPoints
  if (entryPoints) {
    const video = entryPoints.find((ep) => ep.entryPointType === 'video')
    if (video?.uri) return video.uri
  }

  // Scan description for meet links as fallback
  const desc = event.description ?? ''
  const meetMatch = desc.match(/https:\/\/meet\.google\.com\/[a-z-]+/)
  if (meetMatch) return meetMatch[0]

  return undefined
}

function isDeclined(event: calendar_v3.Schema$Event): boolean {
  const self = event.attendees?.find((a) => a.self)
  return self?.responseStatus === 'declined'
}

function parseEventDate(dateTime: string | null | undefined, date: string | null | undefined): Date {
  if (dateTime) return new Date(dateTime)
  if (date) {
    // All-day: parse as local midnight
    const [year, month, day] = date.split('-').map(Number)
    return new Date(year, month - 1, day, 0, 0, 0, 0)
  }
  return new Date()
}

export class CalendarService {
  async getUpcomingEvents(
    hoursAhead = 24,
    calendarIds?: string[]
  ): Promise<CalendarEvent[]> {
    const client = await getValidClient()
    if (!client) throw new Error('Not authenticated')

    const calendarApi = google.calendar({ version: 'v3', auth: client })

    const timeMin = new Date().toISOString()
    const timeMax = new Date(Date.now() + hoursAhead * 60 * 60 * 1000).toISOString()

    const calendars = calendarIds ?? (await this.getCalendarIds())

    const allEvents: CalendarEvent[] = []

    for (const calId of calendars) {
      try {
        const events = await withRetry(() =>
          calendarApi.events.list({
            calendarId: calId,
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: 'startTime',
            maxResults: 50,
            fields:
              'items(id,summary,start,end,hangoutLink,conferenceData,attendees,status,description)'
          })
        )

        const items = events.data.items ?? []
        for (const item of items) {
          if (item.status === 'cancelled') continue
          if (isDeclined(item)) continue
          if (!item.id) continue

          const isAllDay = !!item.start?.date && !item.start?.dateTime
          const startTime = parseEventDate(item.start?.dateTime, item.start?.date)
          const endTime = parseEventDate(item.end?.dateTime, item.end?.date)

          const attendees = (item.attendees ?? [])
            .filter((a) => !a.self && a.email)
            .map((a) => a.email as string)

          allEvents.push({
            id: item.id,
            title: item.summary ?? '(No Title)',
            startTime,
            endTime,
            meetLink: extractMeetLink(item),
            attendeeCount: (item.attendees ?? []).length,
            attendees,
            calendarId: calId,
            isAllDay
          })
        }
      } catch (err) {
        console.error(`[CalendarService] Failed to fetch events for calendar ${calId}:`, err)
      }
    }

    // Sort by start time
    allEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    return allEvents
  }

  async getCalendarList(): Promise<CalendarInfo[]> {
    const client = await getValidClient()
    if (!client) throw new Error('Not authenticated')

    const calendarApi = google.calendar({ version: 'v3', auth: client })

    const response = await withRetry(() =>
      calendarApi.calendarList.list({
        minAccessRole: 'reader',
        fields: 'items(id,summary,backgroundColor,foregroundColor,selected,primary)'
      })
    )

    const items = response.data.items ?? []
    return items
      .filter((cal) => cal.id && cal.summary)
      .map((cal) => ({
        id: cal.id!,
        name: cal.summary!,
        color: cal.backgroundColor ?? '#4285f4'
      }))
  }

  private async getCalendarIds(): Promise<string[]> {
    const cals = await this.getCalendarList()
    return cals.map((c) => c.id)
  }
}
