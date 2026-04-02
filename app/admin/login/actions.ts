'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect('/admin/login?error=Could not authenticate user')
    }

    redirect('/admin')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/admin/login')
}
