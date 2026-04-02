import { createClient } from '@/lib/supabase/server'
import { deleteBlog, togglePublish, createNewBlog } from './actions'
import Link from 'next/link'

export default async function AdminDashboard() {
    const supabase = await createClient()

    const { data: blogs } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#1a1a1a]/80 backdrop-blur-sm p-6 border border-gray-800/80 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <div>
                    <h1 className="text-2xl font-display text-accent-red tracking-widest uppercase">Field Notes Database</h1>
                    <p className="text-gray-500 font-mono text-xs mt-2 uppercase">Manage entries & view analytics</p>
                </div>
                <form action={createNewBlog} className="mt-4 md:mt-0">
                    <button className="bg-red-900/80 hover:bg-red-800 text-white font-mono uppercase text-xs tracking-widest py-3 px-6 shadow-[0_0_10px_rgba(139,0,0,0.2)] hover:shadow-[0_0_20px_rgba(139,0,0,0.5)] transition-all border border-red-900">
                        + New Entry
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {blogs?.map((blog) => (
                    <div key={blog.id} className="bg-[#141414]/90 border border-gray-800/80 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-gray-600 transition-colors">

                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-gray-200 font-mono line-clamp-1">{blog.title}</h2>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] sm:text-xs font-mono text-gray-500 uppercase">
                                <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                                <span className="text-gray-700 hidden sm:inline">|</span>
                                <span className="text-paper-yellow">{blog.view_count || 0} Views</span>
                                <span className="text-gray-700 hidden sm:inline">|</span>
                                <span className={blog.is_published ? 'text-green-700' : 'text-yellow-700'}>
                                    {blog.is_published ? 'Published' : 'Draft'}
                                </span>
                                <span className="text-gray-700 hidden sm:inline">|</span>
                                <span className="text-gray-600">/{blog.slug}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-wider flex-wrap">
                            <Link
                                href={`/admin/editor/${blog.id}`}
                                className="text-gray-400 hover:text-white px-3 sm:px-4 border border-gray-800 py-2 hover:bg-gray-800 transition-colors"
                            >
                                Edit
                            </Link>

                            <form action={togglePublish.bind(null, blog.id, blog.is_published)}>
                                <button className="text-gray-400 hover:text-white px-3 sm:px-4 border border-gray-800 py-2 hover:bg-gray-800 transition-colors">
                                    {blog.is_published ? 'Unpublish' : 'Publish'}
                                </button>
                            </form>

                            <form action={deleteBlog.bind(null, blog.id)}>
                                <button className="text-red-900/70 hover:text-red-400 px-3 sm:px-4 border border-red-900/30 hover:border-red-900/80 py-2 hover:bg-red-900/10 transition-colors">
                                    Delete
                                </button>
                            </form>
                        </div>
                    </div>
                ))}

                {(!blogs || blogs.length === 0) && (
                    <div className="text-center py-16 border border-dashed border-gray-800/50 bg-[#0e0e0e]/50 text-gray-600 font-mono text-sm uppercase tracking-widest">
                        No records found.
                    </div>
                )}
            </div>
        </div>
    )
}
