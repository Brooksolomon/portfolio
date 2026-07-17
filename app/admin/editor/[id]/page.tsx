import { sql } from '@/lib/db'
import { notFound } from 'next/navigation'
import EditorClientWrapper from './EditorClientWrapper'

export const dynamic = 'force-dynamic'

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const [blog] = await sql`SELECT * FROM blogs WHERE id = ${id}`

    if (!blog) {
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
