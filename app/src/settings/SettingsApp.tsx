import React, { useState, useEffect, useCallback } from 'react'
import { Settings, CalendarInfo, AuthStatus } from '../shared/types'

// ─── Default Settings ─────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: Settings = {
  notifyMinutesBefore: 5,
  selectedCalendars: [],
  airplaneColor: '#FFB6C1',
  animationSpeed: 'normal',
  showAllDay: false,
  onlyWithAttendees: false,
  soundEnabled: true,
  launchAtLogin: false
}

const AIRPLANE_COLORS = [
  { name: 'Pink', hex: '#FFB6C1', label: 'Blush' },
  { name: 'Blue', hex: '#AEC6CF', label: 'Sky' },
  { name: 'Mint', hex: '#B5EAD7', label: 'Mint' },
  { name: 'Peach', hex: '#FFDAB9', label: 'Peach' },
  { name: 'Lavender', hex: '#C3B1E1', label: 'Lavender' }
]

type TabId = 'account' | 'notifications' | 'appearance'

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  label,
  description
}: {
  checked: boolean
  onChange: (val: boolean) => void
  label: string
  description?: string
}) {
  return (
    <label className="flex items-center justify-between py-3 cursor-pointer">
      <div>
        <span className="text-sm font-medium text-gray-800">{label}</span>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400',
          checked ? 'bg-pink-400' : 'bg-gray-200'
        ].join(' ')}
      >
        <span
          className={[
            'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-6' : 'translate-x-1'
          ].join(' ')}
        />
      </button>
    </label>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
      {children}
    </h3>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 px-5 py-1 shadow-sm divide-y divide-gray-50 ${className}`}
    >
      {children}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SettingsApp() {
  const [activeTab, setActiveTab] = useState<TabId>('account')
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ authenticated: false })
  const [calendars, setCalendars] = useState<CalendarInfo[]>([])
  const [authLoading, setAuthLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Load on mount
  useEffect(() => {
    window.electronAPI.settings.get().then(setSettings).catch(console.error)
    window.electronAPI.auth.getStatus().then(setAuthStatus).catch(console.error)
  }, [])

  // Load calendars when authenticated
  useEffect(() => {
    if (authStatus.authenticated) {
      window.electronAPI.calendar.getCalendars().then(setCalendars).catch(console.error)
    } else {
      setCalendars([])
    }
  }, [authStatus.authenticated])

  // Listen for auth changes
  useEffect(() => {
    const cleanup = window.electronAPI.onAuthChanged((status) => {
      setAuthStatus(status)
    })
    return cleanup
  }, [])

  // Listen for settings changes from main
  useEffect(() => {
    const cleanup = window.electronAPI.onSettingsChanged((s) => {
      setSettings(s)
    })
    return cleanup
  }, [])

  const handleConnect = async () => {
    setAuthLoading(true)
    try {
      await window.electronAPI.auth.startOAuth()
      const status = await window.electronAPI.auth.getStatus()
      setAuthStatus(status)
    } catch (err) {
      console.error('OAuth failed:', err)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleDisconnect = async () => {
    await window.electronAPI.auth.signOut()
    setAuthStatus({ authenticated: false })
    setCalendars([])
  }

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      await window.electronAPI.settings.save(settings)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }, [settings])

  const handleTestAnimation = () => {
    window.electronAPI.triggerTest()
  }

  const toggleCalendar = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      selectedCalendars: prev.selectedCalendars.includes(id)
        ? prev.selectedCalendars.filter((c) => c !== id)
        : [...prev.selectedCalendars, id]
    }))
  }

  const TABS: { id: TabId; label: string; emoji: string }[] = [
    { id: 'account', label: 'Account', emoji: '👤' },
    { id: 'notifications', label: 'Notifications', emoji: '🔔' },
    { id: 'appearance', label: 'Appearance', emoji: '🎨' }
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden select-none">
      {/* ── Title Bar ── */}
      <div
        className="settings-drag-region flex items-center justify-between px-4 h-11 bg-white border-b border-gray-100 flex-shrink-0"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">✈️</span>
          <span className="text-sm font-semibold text-gray-700">Flyby</span>
        </div>

        {/* Window controls (custom, non-macOS) */}
        <div
          className="settings-no-drag flex items-center gap-1.5"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <button
            onClick={() => window.electronAPI.window.minimizeSettings()}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-xs transition-colors"
            aria-label="Minimize"
          >
            —
          </button>
          <button
            onClick={() => window.electronAPI.window.closeSettings()}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-gray-500 text-sm transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex bg-white border-b border-gray-100 px-4 flex-shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              'flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-150',
              activeTab === tab.id
                ? 'border-pink-400 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ].join(' ')}
          >
            <span>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {/* ══ Account Tab ══ */}
        {activeTab === 'account' && (
          <div className="space-y-4 max-w-lg">
            <SectionLabel>Google Account</SectionLabel>

            <Card>
              <div className="py-4 flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: 'rgba(255,182,193,0.25)' }}
                >
                  {authStatus.authenticated ? '✅' : '🔒'}
                </div>
                <div className="flex-1 min-w-0">
                  {authStatus.authenticated ? (
                    <>
                      <p className="text-sm font-medium text-gray-800">Connected</p>
                      {authStatus.email && (
                        <p className="text-xs text-gray-500 truncate">{authStatus.email}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-800">Not connected</p>
                      <p className="text-xs text-gray-500">
                        Connect your Google account to get meeting alerts
                      </p>
                    </>
                  )}
                </div>

                {authStatus.authenticated ? (
                  <button
                    onClick={handleDisconnect}
                    className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={handleConnect}
                    disabled={authLoading}
                    className="flex-shrink-0 px-4 py-1.5 text-xs font-semibold text-white rounded-full transition-all disabled:opacity-60"
                    style={{ background: authLoading ? '#d1d5db' : '#FFB6C1' }}
                  >
                    {authLoading ? 'Opening...' : 'Connect'}
                  </button>
                )}
              </div>
            </Card>

            {!authStatus.authenticated && (
              <p className="text-xs text-gray-400 leading-relaxed px-1">
                Flyby uses read-only access to your Google Calendar. Your data never leaves your
                device — the app queries the calendar API directly.
              </p>
            )}
          </div>
        )}

        {/* ══ Notifications Tab ══ */}
        {activeTab === 'notifications' && (
          <div className="space-y-5 max-w-lg">
            <div>
              <SectionLabel>Alert Timing</SectionLabel>
              <Card>
                <div className="py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">
                      Notify me before meetings
                    </span>
                    <span
                      className="text-sm font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,182,193,0.25)', color: '#b5294e' }}
                    >
                      {settings.notifyMinutesBefore} min
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={settings.notifyMinutesBefore}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifyMinutesBefore: Number(e.target.value)
                      }))
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1 min</span>
                    <span>30 min</span>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <SectionLabel>Filters</SectionLabel>
              <Card>
                <Toggle
                  checked={settings.showAllDay}
                  onChange={(val) => setSettings((prev) => ({ ...prev, showAllDay: val }))}
                  label="Show all-day events"
                  description="Include all-day events in meeting alerts"
                />
                <Toggle
                  checked={settings.onlyWithAttendees}
                  onChange={(val) =>
                    setSettings((prev) => ({ ...prev, onlyWithAttendees: val }))
                  }
                  label="Only meetings with attendees"
                  description="Skip solo events and reminders"
                />
              </Card>
            </div>

            {calendars.length > 0 && (
              <div>
                <SectionLabel>Calendars</SectionLabel>
                <Card>
                  {calendars.map((cal) => (
                    <label
                      key={cal.id}
                      className="flex items-center gap-3 py-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={
                          settings.selectedCalendars.length === 0 ||
                          settings.selectedCalendars.includes(cal.id)
                        }
                        onChange={() => toggleCalendar(cal.id)}
                        className="sr-only"
                      />
                      <span
                        className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors"
                        style={{
                          background:
                            settings.selectedCalendars.length === 0 ||
                            settings.selectedCalendars.includes(cal.id)
                              ? cal.color
                              : 'transparent',
                          borderColor: cal.color
                        }}
                      >
                        {(settings.selectedCalendars.length === 0 ||
                          settings.selectedCalendars.includes(cal.id)) && (
                          <svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                          >
                            <path
                              d="M1 4L3.5 6.5L9 1"
                              stroke="white"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="text-sm text-gray-700 truncate">{cal.name}</span>
                    </label>
                  ))}
                  {calendars.length === 0 && authStatus.authenticated && (
                    <div className="py-3 text-sm text-gray-400">Loading calendars...</div>
                  )}
                </Card>
                <p className="text-xs text-gray-400 mt-2 px-1">
                  Uncheck calendars to ignore their events. Leaving all checked monitors all
                  calendars.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ══ Appearance Tab ══ */}
        {activeTab === 'appearance' && (
          <div className="space-y-5 max-w-lg">
            <div>
              <SectionLabel>Airplane Color</SectionLabel>
              <Card className="!divide-y-0">
                <div className="py-4 flex gap-4 flex-wrap">
                  {AIRPLANE_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() =>
                        setSettings((prev) => ({ ...prev, airplaneColor: c.hex }))
                      }
                      className="flex flex-col items-center gap-1.5 group"
                      title={c.name}
                    >
                      <span
                        className="w-10 h-10 rounded-full block transition-all duration-150"
                        style={{
                          background: c.hex,
                          boxShadow:
                            settings.airplaneColor === c.hex
                              ? `0 0 0 3px white, 0 0 0 5px ${c.hex}`
                              : '0 2px 6px rgba(0,0,0,0.12)',
                          transform:
                            settings.airplaneColor === c.hex ? 'scale(1.1)' : 'scale(1)'
                        }}
                      />
                      <span className="text-xs text-gray-500">{c.label}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            <div>
              <SectionLabel>Animation Speed</SectionLabel>
              <Card className="!divide-y-0">
                <div className="py-4 flex gap-2">
                  {(['slow', 'normal', 'fast'] as Settings['animationSpeed'][]).map((speed) => (
                    <button
                      key={speed}
                      onClick={() =>
                        setSettings((prev) => ({ ...prev, animationSpeed: speed }))
                      }
                      className={[
                        'flex-1 py-2 text-sm font-medium rounded-xl border-2 transition-all duration-150 capitalize',
                        settings.animationSpeed === speed
                          ? 'border-pink-300 text-pink-600'
                          : 'border-gray-100 text-gray-500 hover:border-gray-200'
                      ].join(' ')}
                      style={{
                        background:
                          settings.animationSpeed === speed
                            ? 'rgba(255,182,193,0.15)'
                            : 'transparent'
                      }}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            <div>
              <SectionLabel>Sound & Startup</SectionLabel>
              <Card>
                <Toggle
                  checked={settings.soundEnabled}
                  onChange={(val) => setSettings((prev) => ({ ...prev, soundEnabled: val }))}
                  label="Sound effects"
                  description="Play a soft whoosh when the airplane flies by"
                />
                <Toggle
                  checked={settings.launchAtLogin}
                  onChange={(val) =>
                    setSettings((prev) => ({ ...prev, launchAtLogin: val }))
                  }
                  label="Launch at login"
                  description="Start Flyby automatically when you log in"
                />
              </Card>
            </div>

            <div>
              <SectionLabel>Preview</SectionLabel>
              <button
                onClick={handleTestAnimation}
                className="w-full py-3 text-sm font-semibold rounded-2xl border-2 border-dashed border-pink-200 text-pink-500 hover:border-pink-300 hover:bg-pink-50 transition-colors"
              >
                ✈️ Test Flyby Animation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer / Save Bar ── */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 px-5 py-3 flex items-center justify-end gap-3">
        {saveSuccess && (
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            <span>✓</span> Saved
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 text-sm font-semibold text-white rounded-full transition-all disabled:opacity-60 active:scale-95"
          style={{ background: saving ? '#d1d5db' : '#FFB6C1' }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}

export default SettingsApp
