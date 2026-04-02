'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveBlogContent(id: string, title: string, content: any) {
    const supabase = await createClient()
    const { error } = await supabase.from('blogs').update({ title, content }).eq('id', id)

    if (error) {
        console.error("Failed to save blog:", error)
        return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    revalidatePath(`/admin/editor/${id}`)
    return { success: true }
}
