'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteBlog(id: string) {
    const supabase = await createClient()
    await supabase.from('blogs').delete().eq('id', id)
    revalidatePath('/admin')
}

export async function togglePublish(id: string, currentStatus: boolean) {
    const supabase = await createClient()
    await supabase.from('blogs').update({ is_published: !currentStatus }).eq('id', id)
    revalidatePath('/admin')
}

export async function createNewBlog() {
    const supabase = await createClient()

    const id = crypto.randomUUID()

    // create an empty draft
    const { data, error } = await supabase.from('blogs').insert({
        id,
        title: 'Untitled Field Note',
        slug: id,
        content: {}, // defaults to empty block for novel
        is_published: false
    }).select().single()

    if (!error && data) {
        redirect(`/admin/editor/${data.id}`)
    } else {
        console.error(error)
    }
}
