'use server'

import { compare } from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createSessionToken, sessionCookieName, sessionCookieOptions } from '@/lib/auth'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const validEmail = email === process.env.ADMIN_EMAIL
    const validPassword = validEmail && await compare(password, process.env.ADMIN_PASSWORD_HASH!)

    if (!validPassword) {
        redirect('/admin/login?error=Could not authenticate user')
    }

    const token = await createSessionToken(email)
    const cookieStore = await cookies()
    cookieStore.set(sessionCookieName, token, sessionCookieOptions)

    redirect('/admin')
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete(sessionCookieName)
    redirect('/admin/login')
}
