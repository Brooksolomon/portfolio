import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EditorClientWrapper from './EditorClientWrapper'

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const supabase = await createClient()

    const { data: blog, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !blog) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto font-sans">
            <div className="mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-xl font-display text-accent-red tracking-widest uppercase">
                    Classified Entry
                </h1>
                <p className="font-mono text-gray-500 text-xs mt-1 uppercase tracking-wider">
                    Reference: {id}
                </p>
            </div>

            <EditorClientWrapper blog={blog} />
        </div>
    )
}
