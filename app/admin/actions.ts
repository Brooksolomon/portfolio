'use server'

import { sql } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteBlog(id: string) {
    await requireAdmin()
    await sql`DELETE FROM blogs WHERE id = ${id}`
    revalidatePath('/admin')
}

export async function togglePublish(id: string, currentStatus: boolean) {
    await requireAdmin()
    await sql`UPDATE blogs SET is_published = ${!currentStatus} WHERE id = ${id}`
    revalidatePath('/admin')
}

export async function createNewBlog() {
    await requireAdmin()

    const id = crypto.randomUUID()

    const [blog] = await sql`
        INSERT INTO blogs (id, title, slug, content, is_published)
        VALUES (${id}, 'Untitled Field Note', ${id}, ${sql.json({})}, false)
        RETURNING id
    `

    if (blog) {
        redirect(`/admin/editor/${blog.id}`)
    }
}
