import { NextResponse, type NextRequest } from 'next/server'
import { verifySessionToken, sessionCookieName } from '@/lib/auth'

export async function middleware(request: NextRequest) {
    if (!request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.next()
    }

    if (!process.env.SESSION_SECRET || !process.env.ADMIN_EMAIL) {
        // Can't authenticate without auth configured
        return NextResponse.redirect(new URL('/', request.url))
    }

    const token = request.cookies.get(sessionCookieName)?.value
    const session = token ? await verifySessionToken(token) : null
    const isAdmin = session && session.email === process.env.ADMIN_EMAIL

    if (!isAdmin) {
        if (request.nextUrl.pathname !== '/admin/login') {
            const url = request.nextUrl.clone()
            url.pathname = '/admin/login'
            return NextResponse.redirect(url)
        }
    } else {
        if (request.nextUrl.pathname === '/admin/login') {
            const url = request.nextUrl.clone()
            url.pathname = '/admin'
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
