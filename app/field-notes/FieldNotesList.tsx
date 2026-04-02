'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 100, damping: 20 }
    }
}

export default function FieldNotesList({ blogs }: { blogs: any[] }) {
    if (!blogs || blogs.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="col-span-full py-24 text-center border border-dashed border-red-900/30 bg-red-900/5 rounded-3xl shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-sm"
            >
                <p className="text-red-500/70 font-mono uppercase tracking-[0.3em] font-bold">No archives currently accessible.</p>
            </motion.div>
        )
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
        >
            {blogs.map((blog) => (
                <Link href={`/field-notes/${blog.slug}`} key={blog.id} className="block group" style={{ perspective: '1200px' }}>
                    <motion.div
                        variants={cardVariants}
                        whileHover={{ scale: 1.02, rotateY: 2, rotateX: 2 }}
                        className="h-full relative overflow-hidden bg-gradient-to-br from-[#111111]/90 to-[#0a0a0a]/90 backdrop-blur-xl border border-white/5 p-8 rounded-3xl transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(220,38,38,0.15)] group-hover:border-red-500/30"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Animated Laser Border Line */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500" />

                        {/* Glow orb */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/20 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        <div className="flex items-center gap-4 mb-8 relative z-10">
                            <span className="text-[10px] font-mono text-red-300 bg-red-900/30 uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-red-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                                Classified
                            </span>
                            <span className="text-[10px] font-mono text-gray-400 tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                {new Date(blog.created_at).toLocaleDateString()}
                            </span>
                        </div>

                        <h2 className="text-2xl font-black text-gray-200 group-hover:text-white transition-colors mb-4 line-clamp-3 leading-tight drop-shadow-md relative z-10" style={{ transform: 'translateZ(20px)' }}>
                            {blog.title}
                        </h2>

                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between z-10 relative group-hover:border-red-900/30 transition-colors">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/80 group-hover:bg-yellow-400 group-hover:shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-all" />
                                <span className="text-[10px] font-mono text-gray-400 group-hover:text-gray-300 uppercase tracking-[0.1em] font-bold transition-colors">
                                    {blog.view_count || 0} Views
                                </span>
                            </div>
                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-hover:text-red-400 transition-colors flex items-center gap-2 font-bold bg-white/5 group-hover:bg-red-500/10 px-3 py-1.5 rounded-full">
                                Extract Intel
                                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                            </span>
                        </div>
                    </motion.div>
                </Link>
            ))}
        </motion.div>
    )
}
