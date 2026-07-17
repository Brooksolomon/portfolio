import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'session'
const SESSION_DURATION = '7d'

function getSecret() {
    return new TextEncoder().encode(process.env.SESSION_SECRET!)
}

export async function createSessionToken(email: string) {
    return new SignJWT({ email })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(SESSION_DURATION)
        .sign(getSecret())
}

export async function verifySessionToken(token: string): Promise<{ email: string } | null> {
    try {
        const { payload } = await jwtVerify(token, getSecret())
        if (typeof payload.email !== 'string') return null
        return { email: payload.email }
    } catch {
        return null
    }
}

export const sessionCookieName = SESSION_COOKIE

export const sessionCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
}

// Re-verifies the session cookie inside a server action (defense in depth
// beyond the middleware check — actions can be invoked directly).
export async function requireAdmin() {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    const session = token ? await verifySessionToken(token) : null

    if (!session || session.email !== process.env.ADMIN_EMAIL) {
        throw new Error('Unauthorized')
    }

    return session
}
