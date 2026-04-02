'use client'

import { useState, useEffect, useTransition } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { postComment } from './actions'
import { motion, AnimatePresence } from 'framer-motion'

export default function CommentsSection({ blogId, blogSlug, initialComments }: any) {
    const [anonId, setAnonId] = useState<string>('')
    const [content, setContent] = useState('')
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        let id = localStorage.getItem('case_404_anon_id')
        if (!id) {
            id = uuidv4()
            localStorage.setItem('case_404_anon_id', id)
        }
        setAnonId(id)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim() || !anonId) return

        startTransition(async () => {
            await postComment(blogId, content, anonId, blogSlug)
            setContent('')
        })
    }

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                    <div className="w-2 h-8 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                    Log Entries
                </h3>
                <span className="font-mono text-xs text-red-400 bg-red-900/20 px-4 py-2 rounded-full border border-red-900/30 uppercase tracking-[0.2em] shadow-inner">
                    {initialComments?.length || 0} Records
                </span>
            </div>

            <div className="space-y-6">
                <AnimatePresence>
                    {initialComments?.map((comment: any, idx: number) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-[#111]/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg border border-white/5 relative overflow-hidden group hover:border-red-900/30 transition-colors"
                        >
                            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-red-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-gray-700 font-mono text-xs text-gray-400 shadow-inner">
                                        {comment.anonymous_user_id.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className={`font-mono text-xs uppercase tracking-widest ${comment.anonymous_user_id === anonId
                                            ? 'text-red-400 font-bold drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]'
                                            : 'text-gray-400'
                                        }`}>
                                        {comment.anonymous_user_id === anonId ? 'Agent (You)' : `Anon-${comment.anonymous_user_id.substring(0, 6)}`}
                                    </span>
                                </div>
                                <span className="text-gray-600 font-mono text-[10px] sm:text-xs tracking-wider bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    {new Date(comment.created_at).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-gray-300 font-sans leading-relaxed text-sm md:text-base pl-1 md:pl-12">
                                {comment.content}
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-[2rem] p-1 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-red-900/20 relative mt-16"
            >
                <div className="bg-[#0a0a0a] rounded-[31px] p-6 md:p-10 relative overflow-hidden">
                    {/* Diagonal scanline decor */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

                    <form onSubmit={handleSubmit} className="relative z-10">
                        <label className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.2em] text-red-500/80 mb-6">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                            Transmit Secure Observation
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-[#111]/50 border border-white/10 rounded-2xl focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 p-6 min-h-[160px] text-gray-200 font-sans text-base leading-relaxed focus:outline-none transition-all mb-6 placeholder-gray-700 resize-y shadow-inner"
                            placeholder="Log your findings down to the last detail..."
                            maxLength={1000}
                            required
                        />
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest bg-white/5 px-5 py-2.5 rounded-full border border-white/5 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Session: {anonId ? `...${anonId.slice(-8)}` : 'Initializing...'}
                            </span>
                            <button
                                type="submit"
                                disabled={isPending || !content.trim() || !anonId}
                                className="w-full sm:w-auto bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold uppercase font-mono text-xs tracking-[0.2em] px-10 py-4 rounded-full transition-all disabled:opacity-50 disabled:hover:from-red-700 disabled:hover:to-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none"
                            >
                                {isPending ? 'Transmitting...' : 'Send Intel'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}
