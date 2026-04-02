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
        <div className="min-h-screen relative font-sans selection:bg-red-900/50 selection:text-white">
            {/* Background Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-red-900/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
                {/* Dossier Header - Glassmorphism */}
                <div className="bg-[#111]/80 backdrop-blur-xl border border-white/5 p-8 md:p-12 mb-16 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                    {/* Classified watermark */}
                    <div className="absolute -right-10 -top-10 text-7xl md:text-9xl font-black text-red-900/5 rotate-[-10deg] pointer-events-none select-none uppercase tracking-tighter mix-blend-overlay group-hover:scale-105 transition-transform duration-1000">
                        CONFIDENTIAL
                    </div>

                    {/* Animated Gradient Edge */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900/0 via-red-600 to-red-900/0 opacity-50" />

                    <div className="flex flex-wrap items-center gap-4 mb-8 relative z-10">
                        <span className="bg-red-500/10 text-red-400 font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                            Field Report
                        </span>
                        <span className="text-gray-400 font-mono text-xs uppercase tracking-[0.2em] bg-black/40 px-4 py-2 rounded-full border border-white/5">
                            {new Date(blog.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-yellow-600/80 font-mono text-xs uppercase tracking-[0.2em] bg-black/40 px-4 py-2 rounded-full border border-white/5 ml-auto hidden sm:block">
                            ID: {blog.id.substring(0, 8)}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 leading-tight relative z-10 tracking-tight">
                        {blog.title}
                    </h1>
                </div>

                {/* EditorRenderer component */}
                <div className="mb-24 bg-[#0a0a0a]/60 backdrop-blur-md p-6 md:p-12 rounded-3xl border border-white/5 shadow-2xl relative">
                    <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-red-900/40 to-transparent -translate-y-1/2 rounded-r-md" />
                    <FieldNoteClientRenderer content={blog.content} />
                </div>

                {/* Comments / Annotations Section */}
                <div className="relative">
                    {/* Glowing separator */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />
                    <div className="pt-16">
                        <CommentsSection blogId={blog.id} blogSlug={slug} initialComments={comments} />
                    </div>
                </div>
            </div>
        </div>
    )
}
