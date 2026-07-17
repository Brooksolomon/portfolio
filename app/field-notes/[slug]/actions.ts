'use server'

import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function incrementViewCount(slug: string) {
    await sql`SELECT increment_view_count(${slug})`
}

export async function getComments(blogId: string) {
    return sql`SELECT * FROM comments WHERE blog_id = ${blogId} ORDER BY created_at ASC`
}

export async function postComment(blogId: string, content: string, anonymousUserId: string, blogSlug: string) {
    try {
        await sql`
            INSERT INTO comments (blog_id, content, anonymous_user_id)
            VALUES (${blogId}, ${content}, ${anonymousUserId})
        `
    } catch (error: any) {
        return { success: false, error: error.message }
    }

    revalidatePath(`/field-notes/${blogSlug}`)
    return { success: true }
}
