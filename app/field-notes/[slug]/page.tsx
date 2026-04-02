import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { incrementViewCount, getComments } from './actions'
import FieldNoteClientRenderer from './FieldNoteClientRenderer'
import CommentsSection from './CommentsSection'

export const dynamic = 'force-dynamic'

export default async function FieldNoteDetail({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const supabase = await createClient()

    const { data: blog, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

    if (error || !blog) {
        notFound()
    }

    // Fetch comments array
    const comments = await getComments(blog.id)

    // Fire-and-forget view count increment
    incrementViewCount(slug).catch(console.error)

    return (
        <div className="max-w-3xl mx-auto px-4 py-16 font-sans relative">
            {/* Dossier Header */}
            <div className="border-b border-gray-800 pb-8 mb-12 relative overflow-hidden">
                {/* Classified watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-black text-red-900/5 rotate-[-15deg] pointer-events-none select-none uppercase tracking-tighter w-full text-center mix-blend-overlay">
                    CONFIDENTIAL
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <span className="bg-red-900/20 text-accent-red font-mono text-xs uppercase tracking-widest px-3 py-1 border border-red-900/50">
                        Field Report
                    </span>
                    <span className="text-gray-500 font-mono text-xs uppercase tracking-widest">
                        {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-gray-100 leading-tight">
                    {blog.title}
                </h1>
            </div>

            {/* EditorRenderer component for displaying tiptap JSON */}
            <div className="mb-16">
                <FieldNoteClientRenderer content={blog.content} />
            </div>

            {/* Comments / Annotations Section */}
            <div className="border-t-2 border-dashed border-gray-800 pt-16">
                <CommentsSection blogId={blog.id} blogSlug={slug} initialComments={comments} />
            </div>
        </div>
    )
}
