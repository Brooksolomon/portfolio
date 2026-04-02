'use client'

import { useState, useEffect, useTransition } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { postComment } from './actions'

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
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-display text-gray-200 uppercase tracking-widest">
                    Annotations
                </h3>
                <span className="font-mono text-xs text-gray-500 uppercase">
                    {initialComments?.length || 0} Records
                </span>
            </div>

            <div className="space-y-6">
                {initialComments?.map((comment: any) => (
                    <div key={comment.id} className="bg-[#141414] border border-gray-800/50 p-4">
                        <div className="flex items-center gap-3 mb-2 font-mono text-[10px] sm:text-xs">
                            <span className={`px-2 py-1 uppercase tracking-widest ${comment.anonymous_user_id === anonId
                                    ? 'bg-red-900/20 text-red-400 border border-red-900/50'
                                    : 'bg-gray-800 text-gray-400'
                                }`}>
                                {comment.anonymous_user_id === anonId ? 'You (Current Agent)' : `Anon-${comment.anonymous_user_id.substring(0, 6)}`}
                            </span>
                            <span className="text-gray-600">
                                {new Date(comment.created_at).toLocaleString()}
                            </span>
                        </div>
                        <p className="text-gray-300 font-sans mt-2 whitespace-pre-wrap text-sm md:text-base">
                            {comment.content}
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-[#1a1a1a] border border-gray-700/50 p-6 mt-8 shadow-inner relative">
                {/* Decor */}
                <div className="absolute top-0 left-4 w-12 h-1 bg-red-900" />

                <form onSubmit={handleSubmit}>
                    <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
                        Add Annotation (Anonymous)
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-[#0e0e0e] border border-gray-800 focus:border-red-900/50 p-4 min-h-[120px] text-gray-200 font-sans focus:outline-none transition-colors mb-4 placeholder-gray-700"
                        placeholder="Log your observations..."
                        maxLength={1000}
                        required
                    />
                    <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] text-gray-600 uppercase">
                            ID: {anonId ? `...${anonId.slice(-8)}` : 'Generating...'}
                        </span>
                        <button
                            type="submit"
                            disabled={isPending || !content.trim() || !anonId}
                            className="bg-transparent hover:bg-red-900/10 text-gray-300 hover:text-white border border-gray-700 hover:border-red-900 uppercase font-mono text-xs tracking-widest px-6 py-2 transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'Submitting...' : 'Submit Log'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
