'use server'

import { sql } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function saveBlogContent(id: string, title: string, content: any) {
    await requireAdmin()

    try {
        await sql`UPDATE blogs SET title = ${title}, content = ${sql.json(content)} WHERE id = ${id}`
    } catch (error: any) {
        console.error("Failed to save blog:", error)
        return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    revalidatePath(`/admin/editor/${id}`)
    return { success: true }
}
