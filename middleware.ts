import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // We only initialize Supabase if the env variables are present to avoid build crashes
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        if (request.nextUrl.pathname.startsWith('/admin')) {
            // Can't authenticate without supabase configured
            return NextResponse.redirect(new URL('/', request.url))
        }
        return response
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Protect administrator routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Determine admin matching. If ADMIN_EMAIL is not yet set, we'll still only allow logged in users,
        // but ideally we check process.env.ADMIN_EMAIL.
        const isAdmin = user && (!process.env.ADMIN_EMAIL || user.email === process.env.ADMIN_EMAIL)

        if (!isAdmin) {
            // Unauthenticated -> Redirect to login
            if (request.nextUrl.pathname !== '/admin/login') {
                const url = request.nextUrl.clone()
                url.pathname = '/admin/login'
                return NextResponse.redirect(url)
            }
        } else {
            // Authenticated -> Redirect away from login if trying to access it
            if (request.nextUrl.pathname === '/admin/login') {
                const url = request.nextUrl.clone()
                url.pathname = '/admin'
                return NextResponse.redirect(url)
            }
        }
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
