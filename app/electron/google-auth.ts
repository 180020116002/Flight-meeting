import { google } from 'googleapis'
import { OAuth2Client, Credentials } from 'google-auth-library'
import { app, shell } from 'electron'
import * as http from 'http'
import * as url from 'url'
import Store from 'electron-store'
import { safeStorage } from 'electron'

// TODO: Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment,
// or replace the getClientCredentials() function with your actual credentials.
// You must create OAuth 2.0 credentials in the Google Cloud Console:
// https://console.cloud.google.com/apis/credentials
// Set the authorized redirect URI to: http://localhost:42813/oauth/callback

const REDIRECT_PORT = 42813
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/oauth/callback`
const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
]

interface StoredTokens {
  encrypted: string
}

interface StoreSchema {
  tokens: StoredTokens
}

const store = new Store<StoreSchema>({ name: 'flyby-auth' })

function getClientCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing Google OAuth credentials.\n' +
      'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables,\n' +
      'or update electron/google-auth.ts with your credentials from:\n' +
      'https://console.cloud.google.com/apis/credentials'
    )
  }

  return { clientId, clientSecret }
}

function createOAuth2Client(): OAuth2Client {
  const { clientId, clientSecret } = getClientCredentials()
  return new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI)
}

function encryptTokens(tokens: Credentials): string {
  const json = JSON.stringify(tokens)
  if (safeStorage.isEncryptionAvailable()) {
    const encrypted = safeStorage.encryptString(json)
    return encrypted.toString('base64')
  }
  // Fallback: store as plain base64 (less secure, but functional in CI/headless)
  return Buffer.from(json).toString('base64')
}

function decryptTokens(encrypted: string): Credentials {
  const buffer = Buffer.from(encrypted, 'base64')
  if (safeStorage.isEncryptionAvailable()) {
    const json = safeStorage.decryptString(buffer)
    return JSON.parse(json) as Credentials
  }
  // Fallback: plain base64 decode
  return JSON.parse(buffer.toString('utf8')) as Credentials
}

export async function startOAuthFlow(): Promise<void> {
  const oauth2Client = createOAuth2Client()

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES
  })

  return new Promise((resolve, reject) => {
    let server: http.Server | null = null
    let resolved = false

    const cleanup = () => {
      if (server) {
        server.close()
        server = null
      }
    }

    server = http.createServer(async (req, res) => {
      if (!req.url || resolved) return

      const parsedUrl = url.parse(req.url, true)
      if (!parsedUrl.pathname?.startsWith('/oauth/callback')) return

      const code = parsedUrl.query.code as string | undefined
      const error = parsedUrl.query.error as string | undefined

      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/html' })
        res.end(`
          <html><body style="font-family:sans-serif;text-align:center;padding:40px;">
            <h2>Authentication Failed</h2>
            <p>${error}</p>
            <p>You can close this window.</p>
          </body></html>
        `)
        cleanup()
        resolved = true
        reject(new Error(`OAuth error: ${error}`))
        return
      }

      if (!code) {
        res.writeHead(400, { 'Content-Type': 'text/html' })
        res.end('<html><body>Missing code parameter</body></html>')
        return
      }

      try {
        await handleCallback(code)
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(`
          <html><body style="font-family:sans-serif;text-align:center;padding:40px;background:#fdf6ff;">
            <div style="max-width:400px;margin:auto;background:white;border-radius:16px;padding:40px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
              <div style="font-size:48px;margin-bottom:16px;">✈️</div>
              <h2 style="color:#6b46c1;margin-bottom:8px;">You're all set!</h2>
              <p style="color:#718096;">Flyby is now connected to your Google Calendar.<br>You can close this window.</p>
            </div>
          </body></html>
        `)
        cleanup()
        resolved = true
        resolve()
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' })
        res.end(`<html><body>Error: ${String(err)}</body></html>`)
        cleanup()
        resolved = true
        reject(err)
      }
    })

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        reject(new Error(`Port ${REDIRECT_PORT} is already in use. Please close any other app using that port.`))
      } else {
        reject(err)
      }
    })

    server.listen(REDIRECT_PORT, '127.0.0.1', () => {
      shell.openExternal(authUrl).catch(reject)
    })

    // Timeout after 5 minutes
    setTimeout(() => {
      if (!resolved) {
        cleanup()
        resolved = true
        reject(new Error('OAuth flow timed out after 5 minutes.'))
      }
    }, 5 * 60 * 1000)
  })
}

export async function handleCallback(code: string): Promise<void> {
  const oauth2Client = createOAuth2Client()
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)

  const encrypted = encryptTokens(tokens)
  store.set('tokens', { encrypted })
}

export async function getValidClient(): Promise<OAuth2Client | null> {
  const stored = store.get('tokens') as StoredTokens | undefined
  if (!stored?.encrypted) return null

  let tokens: Credentials
  try {
    tokens = decryptTokens(stored.encrypted)
  } catch {
    store.delete('tokens')
    return null
  }

  const oauth2Client = createOAuth2Client()
  oauth2Client.setCredentials(tokens)

  // Refresh if expired or expiring within 2 minutes
  const expiryDate = tokens.expiry_date
  const now = Date.now()
  const twoMinutes = 2 * 60 * 1000

  if (expiryDate && expiryDate - now < twoMinutes) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken()
      oauth2Client.setCredentials(credentials)
      const encrypted = encryptTokens(credentials)
      store.set('tokens', { encrypted })
    } catch (err) {
      console.error('[GoogleAuth] Failed to refresh token:', err)
      store.delete('tokens')
      return null
    }
  }

  return oauth2Client
}

export function isAuthenticated(): boolean {
  const stored = store.get('tokens') as StoredTokens | undefined
  return !!stored?.encrypted
}

export function signOut(): void {
  store.delete('tokens')
}

export type { OAuth2Client }
