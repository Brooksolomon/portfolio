'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function incrementViewCount(slug: string) {
    const supabase = await createClient()

    // We can just execute an RPC if defined, but simple query to increment:
    const { data: blog } = await supabase.from('blogs').select('view_count, id').eq('slug', slug).single()

    if (blog) {
        await supabase.from('blogs')
            .update({ view_count: (blog.view_count || 0) + 1 })
            .eq('id', blog.id)
    }
}

export async function getComments(blogId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('blog_id', blogId)
        .order('created_at', { ascending: true })

    return data || []
}

export async function postComment(blogId: string, content: string, anonymousUserId: string, blogSlug: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('comments').insert({
        blog_id: blogId,
        content,
        anonymous_user_id: anonymousUserId
    })

    if (!error) {
        revalidatePath(`/field-notes/${blogSlug}`)
        return { success: true }
    }
    return { success: false, error: error.message }
}
