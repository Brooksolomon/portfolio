'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Underline from '@tiptap/extension-underline'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Type, Moon, Sun, Clock, BookOpen, Quote, History, Copy, CheckCircle, Eye, EyeOff, Bookmark, BookmarkCheck, HelpCircle, Share } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// Helper to calculate reading time
const calculateReadingTime = (text: string) => {
    const words = text.trim().split(/\s+/).length
    return Math.max(1, Math.ceil(words / 200)) // 200 words per minute
}

export default function FieldNoteClientRenderer({ content, slug, title }: { content: any, slug: string, title: string }) {
    const [progress, setProgress] = useState(0)
    const [readingTime, setReadingTime] = useState(0)
    const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([])
    const [theme, setTheme] = useState<'dark' | 'light'>('dark')
    const [fontSize, setFontSize] = useState<number>(1.1)
    const [isDistractedFree, setIsDistractedFree] = useState(false)
    const [enableDropCaps, setEnableDropCaps] = useState(true)
    const [savedPosition, setSavedPosition] = useState(0)
    const [showPositionSaved, setShowPositionSaved] = useState(false)
    const [showLinkCopied, setShowLinkCopied] = useState(false)
    const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
    
    // Live Users State
    const [activeReaders, setActiveReaders] = useState(1)
    
    // History State
    const [readingHistory, setReadingHistory] = useState<{slug: string, title: string, date: number}[]>([])

    const containerRef = useRef<HTMLDivElement>(null)

    const extensions = [
        Underline,
        TextStyle,
        Color,
        StarterKit.configure({
            heading: {
                HTMLAttributes: {
                    class: 'heading-with-anchor relative group',
                },
            }
        }),
        Image.configure({
            HTMLAttributes: {
                class: 'rounded-xl border w-full max-w-full my-8 shadow-2xl object-cover transition-colors duration-500 tiptap-image',
            },
        }),
        Youtube.configure({
            HTMLAttributes: {
                class: 'w-full aspect-video rounded-xl border my-8 shadow-2xl transition-colors duration-500 tiptap-youtube',
            },
        }),
    ]

    const editor = useEditor({
        editable: false,
        content: content || null,
        extensions,
        editorProps: {
            attributes: {
                class: 'max-w-none tiptap-editor-readonly outline-none',
            },
        },
    })

    useEffect(() => {
        if (editor && content) {
            editor.commands.setContent(content)
            setReadingTime(calculateReadingTime(editor.getText()))
        }
    }, [editor, content])

    // Generate TOC and inline footnotes
    useEffect(() => {
        if (!editor || !containerRef.current) return
        
        const timer = setTimeout(() => {
            if (!containerRef.current) return
            
            // Generate TOC and anchor tags
            const headings = containerRef.current.querySelectorAll('.tiptap-editor-readonly h1, .tiptap-editor-readonly h2, .tiptap-editor-readonly h3')
            const items: typeof toc = []
            
            headings.forEach((h) => {
                const text = h.textContent || ''
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'section-' + Math.random().toString(36).substr(2, 5)
                h.id = id
                
                if (!h.querySelector('.anchor-link')) {
                    const anchor = document.createElement('a')
                    anchor.href = `#${id}`
                    anchor.className = 'anchor-link opacity-0 group-hover:opacity-100 absolute -left-6 md:-left-8 top-1/2 -translate-y-1/2 p-2 text-red-500 transition-opacity flex items-center justify-center'
                    anchor.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>'
                    h.appendChild(anchor)
                }
                
                items.push({
                    id,
                    text: text.replace(/\[\d+\]/g, ''), // ignore footnotes in TOC
                    level: parseInt(h.tagName.charAt(1))
                })
            })
            setToc(items)

            // Convert [1] into footnotes 
            const paragraphs = containerRef.current.querySelectorAll('.tiptap-editor-readonly p, .tiptap-editor-readonly li')
            const definitions = new Map<string, string>()

            paragraphs.forEach(p => {
                const text = p.textContent?.trim() || ''
                const match = text.match(/^\[(\d+)\]\s+(.+)$/)
                if (match) {
                    definitions.set(match[1], match[2])
                    ;(p as HTMLElement).style.opacity = '0.4'
                    ;(p as HTMLElement).style.fontSize = '0.8em'
                }
            })

            paragraphs.forEach(p => {
                if (p.querySelector('.footnote-ref')) return
                
                let html = p.innerHTML
                if (html.match(/\[(\d+)\]/)) {
                    html = html.replace(/(?<!^)\[(\d+)\]/g, (match, number) => {
                        const def = definitions.get(number) || `Classified Footnote Reference #${number}`
                        return `<span class="footnote-ref relative group inline-block text-red-500 font-bold px-0.5 cursor-pointer" tabindex="0">
                            <sup class="text-[0.75em]">[${number}]</sup>
                            <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#111] text-gray-200 text-xs rounded-xl shadow-[0_10px_40px_rgba(220,38,38,0.3)] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 font-sans whitespace-normal border border-red-900/50 text-center leading-relaxed">
                                <strong class="text-red-500 block mb-1 font-mono uppercase tracking-widest">[Ref ${number}]</strong>
                                ${def}
                            </span>
                        </span>`
                    })
                    p.innerHTML = html
                }
            })

        }, 150)
        
        return () => clearTimeout(timer)
    }, [content, editor])

    // Realtime Collaborative Presence Tracker
    useEffect(() => {
        if (!slug) return
        const supabase = createClient()
        const channel = supabase.channel(`online-users-${slug}`)
        
        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState()
                let count = 0
                for (const key in state) count++
                setActiveReaders(count > 0 ? count : 1)
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    const anonId = localStorage.getItem('case_404_anon_id') || ('anon-' + Math.random().toString(36).substring(2, 8))
                    await channel.track({ user: anonId })
                }
            })
            
        return () => { channel.unsubscribe() }
    }, [slug])

    // Reading History
    useEffect(() => {
        if (!slug || !title) return
        const key = 'case_404_reading_history'
        try {
            const raw = localStorage.getItem(key)
            let history: any[] = raw ? JSON.parse(raw) : []
            history = history.filter(h => h.slug !== slug)
            history.unshift({ slug, title, date: Date.now() })
            if (history.length > 5) history = history.slice(0, 5)
            
            localStorage.setItem(key, JSON.stringify(history))
            setReadingHistory(history)
        } catch (e) { console.error(e) }
    }, [slug, title])

    // Progress Bar scroll listener
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            const windowHeight = window.innerHeight
            
            let pct = 0
            if (rect.top <= windowHeight) {
                const scrolled = Math.max(0, windowHeight - rect.top)
                pct = (scrolled / rect.height) * 100
            }
            if (pct < 0) pct = 0
            if (pct > 100) pct = 100
            setProgress(pct)
            
            // Auto-save reading position
            if (slug && pct > 5) { // Only save if user has scrolled past 5%
                const currentSaved = localStorage.getItem(`reading_position_${slug}`)
                const newPosition = pct.toString()
                
                if (!currentSaved || Math.abs(parseFloat(currentSaved) - pct) > 5) {
                    localStorage.setItem(`reading_position_${slug}`, newPosition)
                    
                    // Show brief notification
                    if (currentSaved && Math.abs(parseFloat(currentSaved) - pct) > 10) {
                        setShowPositionSaved(true)
                        setTimeout(() => setShowPositionSaved(false), 2000)
                    }
                }
            }
        }
        window.addEventListener('scroll', handleScroll)
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [slug])

    // Load saved reading position
    useEffect(() => {
        if (!slug) return
        const saved = localStorage.getItem(`reading_position_${slug}`)
        if (saved) {
            setSavedPosition(parseFloat(saved))
        }
    }, [slug])

    // Keyboard shortcuts for reading features
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only handle shortcuts when not typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
            
            switch (e.key) {
                case 'Escape':
                    if (isDistractedFree) {
                        setIsDistractedFree(false)
                        e.preventDefault()
                    }
                    break
                case 'f':
                case 'F':
                    if (e.ctrlKey || e.metaKey) return // Don't interfere with browser find
                    setIsDistractedFree(!isDistractedFree)
                    e.preventDefault()
                    break
                case 'd':
                case 'D':
                    setEnableDropCaps(!enableDropCaps)
                    e.preventDefault()
                    break
                case 'r':
                case 'R':
                    if (savedPosition > 5) {
                        restorePosition()
                        e.preventDefault()
                    }
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isDistractedFree, enableDropCaps, savedPosition])

    // Function to restore reading position
    const restorePosition = () => {
        if (!containerRef.current || savedPosition <= 0) return
        const rect = containerRef.current.getBoundingClientRect()
        const targetScroll = (savedPosition / 100) * rect.height - window.innerHeight + rect.top + window.scrollY
        window.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' })
    }

    const handleShare = async () => {
        const url = window.location.href
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

        if (isMobile && navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: 'Check out this intel report:',
                    url: url,
                })
            } catch (err) {
                // Ignore early aborts
            }
        } else {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(url)
                } else {
                    // Fallback for non-secure contexts (HTTP over network)
                    const textArea = document.createElement("textarea")
                    textArea.value = url
                    document.body.appendChild(textArea)
                    textArea.select()
                    document.execCommand("Copy")
                    textArea.remove()
                }
                setShowLinkCopied(true)
                setTimeout(() => setShowLinkCopied(false), 2000)
            } catch (err) {
                console.error("Clipboard copy failed.", err)
            }
        }
    }

    if (!content || Object.keys(content).length === 0) {
        return <div className="text-gray-600 font-mono italic">No intel has been recorded.</div>
    }

    const t = theme === 'dark'
    
    // Cycle font size
    const toggleFontSize = () => {
        setFontSize(prev => prev >= 1.3 ? 1.1 : prev + 0.1)
    }

    return (
        <div className="relative">

            {/* Distraction-Free Mode Overlay */}
            {isDistractedFree && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100] pointer-events-none" />
            )}

            {/* Position Saved Notification */}
            <AnimatePresence>
                {showPositionSaved && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="fixed bottom-8 right-8 z-[300] bg-[#111] border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)] rounded-xl p-4 flex items-center gap-3 pointer-events-none"
                    >
                        <BookmarkCheck size={16} className="text-green-400" />
                        <span className="font-mono text-xs text-green-400 uppercase tracking-widest">Position Saved</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Link Copied Notification */}
            <AnimatePresence>
                {showLinkCopied && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="fixed bottom-8 left-8 z-[300] bg-[#111] border border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.3)] rounded-xl p-4 flex items-center gap-3 pointer-events-none"
                    >
                        <CheckCircle size={16} className="text-red-400" />
                        <span className="font-mono text-xs text-red-400 uppercase tracking-widest">Link Copied</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Keyboard Shortcuts Help */}
            <AnimatePresence>
                {showKeyboardHelp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowKeyboardHelp(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#111] border border-red-900/50 shadow-[0_0_40px_rgba(220,38,38,0.3)] rounded-xl p-8 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <HelpCircle size={20} className="text-red-400" />
                                Reading Controls
                            </h3>
                            
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Focus Mode</span>
                                    <kbd className="bg-black/50 px-2 py-1 rounded text-xs font-mono text-red-400 border border-red-900/30">F</kbd>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Toggle Drop Caps</span>
                                    <kbd className="bg-black/50 px-2 py-1 rounded text-xs font-mono text-red-400 border border-red-900/30">D</kbd>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Restore Position</span>
                                    <kbd className="bg-black/50 px-2 py-1 rounded text-xs font-mono text-red-400 border border-red-900/30">R</kbd>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Exit Focus Mode</span>
                                    <kbd className="bg-black/50 px-2 py-1 rounded text-xs font-mono text-red-400 border border-red-900/30">ESC</kbd>
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-white/10">
                                <p className="text-xs text-gray-400 font-mono uppercase tracking-widest text-center">
                                    Reading position auto-saves as you scroll
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top Right Navbar Header Override via Fixed Placement */}
            <div className={`fixed top-4 right-4 md:right-8 z-[200] pointer-events-none drop-shadow-xl animate-fade-in flex items-center gap-3 transition-opacity duration-500 ${isDistractedFree ? 'opacity-20 hover:opacity-100' : 'opacity-100'}`}>
                <div className="bg-[#1a1a1a]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-red-900/40 shadow-[0_0_20px_rgba(220,38,38,0.15)] flex items-center gap-3">
                    <div className="relative flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping absolute" />
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full relative shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                    </div>
                    <div className="font-mono text-[9px] md:text-xs font-bold text-gray-300 uppercase tracking-widest">
                        {activeReaders} {activeReaders === 1 ? 'AGENT' : 'AGENTS'} READING
                    </div>
                </div>
            </div>

            {/* Reading Progress HUD (Visible on Desktop Left Edge) */}
            <div className={`fixed top-1/2 left-2 md:left-6 -translate-y-1/2 z-50 flex-col items-center gap-4 pointer-events-none hidden xl:flex transition-opacity duration-500 ${isDistractedFree ? 'opacity-20 hover:opacity-100' : 'opacity-100'}`}>
                <div className="w-1 h-48 bg-black/20 dark:bg-white/5 rounded-full relative overflow-hidden backdrop-blur-sm border border-red-900/20 shadow-inner">
                    <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-red-500 to-red-800 transition-all duration-150" style={{ height: `${progress}%` }} />
                </div>
                <div className="font-mono text-[9px] text-red-500 uppercase tracking-widest font-bold bg-black/50 px-2 py-1 rounded-md border border-red-900/40">
                    {Math.round(progress)}%
                </div>
                <div className="font-mono text-[9px] text-red-500/60 uppercase tracking-[0.3em] transition-all rotate-180 mix-blend-screen" style={{ writingMode: 'vertical-rl' }}>
                    Data Extraction
                </div>
            </div>

            <div ref={containerRef} className={`mb-24 ${t ? 'bg-[#0a0a0a]/60 backdrop-blur-md border-white/5 shadow-2xl' : 'bg-[#fff5ee] border-gray-300 shadow-md'} rounded-3xl border relative group transition-all duration-700 font-sans theme-wrapper ${t ? 'theme-dark' : 'theme-light'} ${isDistractedFree ? 'z-[150] relative' : ''} ${enableDropCaps ? 'drop-caps-enabled' : ''}`}>
                
                {/* Dark Mode Specific Decorations */}
                {t && (
                    <>
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-900/20 to-transparent group-hover:via-red-500/40 transition-all duration-1000" />
                        <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-red-900/40 to-transparent -translate-y-1/2 rounded-r-md group-hover:h-48 group-hover:via-red-500/60 transition-all duration-700 delay-100" />
                    </>
                )}

                <div className="p-6 md:p-12">
                    {/* Main Content Pane */}
                    <div className="w-full min-w-0">
                        
                        {/* Reader Controls Toolbar */}
                        <div className={`flex flex-wrap items-center justify-between pb-6 mb-8 border-b ${t ? 'border-white/10' : 'border-black/10'} transition-colors relative z-20`}>
                            <div className="flex items-center gap-4 text-[10px] sm:text-xs font-mono uppercase tracking-widest w-full sm:w-auto mb-4 sm:mb-0">
                                <span className={`flex items-center gap-2 ${t ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <Clock size={14} className={t ? 'text-red-500' : 'text-red-600'} /> {readingTime} MIN READ
                                </span>
                                <div className="w-[1px] h-3 bg-gray-500/30" />
                                <button onClick={handleShare} className={`flex items-center gap-2 hover:text-red-400 transition-colors ${t ? 'text-gray-400' : 'text-gray-500'}`} title="Share this intel">
                                    <Share size={14} /> SHARE
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-1 sm:gap-2 bg-black/5 rounded-full p-1 border border-black/5 dark:bg-white/5 dark:border-white/5 mx-auto sm:mx-0">
                                <button onClick={toggleFontSize} className={`p-2 rounded-full ${t ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/10 text-gray-600'} transition-colors flex items-center gap-1.5 px-3`} title="Adjust reading font size - cycles between 1.1x, 1.2x, and 1.3x">
                                    <Type size={14} /> <span className="text-[10px] font-mono leading-none">{fontSize.toFixed(1)}x</span>
                                </button>
                                <div className="w-[1px] h-4 bg-gray-500/20" />
                                <button onClick={() => setEnableDropCaps(!enableDropCaps)} className={`p-2 rounded-full ${enableDropCaps ? (t ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-600') : (t ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/10 text-gray-600')} transition-colors px-3`} title={enableDropCaps ? "Disable magazine-style drop caps" : "Enable magazine-style drop caps - makes the first letter large and decorative"}>
                                    <span className="text-sm font-serif font-bold">A</span>
                                </button>
                                <div className="w-[1px] h-4 bg-gray-500/20" />
                                <button onClick={() => setIsDistractedFree(!isDistractedFree)} className={`p-2 rounded-full ${isDistractedFree ? (t ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-600') : (t ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/10 text-gray-600')} transition-colors px-3`} title={isDistractedFree ? "Exit distraction-free reading mode" : "Enter distraction-free reading mode - dims everything except the article"}>
                                    {isDistractedFree ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                                <div className="w-[1px] h-4 bg-gray-500/20" />
                                <button onClick={() => setTheme(t ? 'light' : 'dark')} className={`p-2 rounded-full ${t ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/10 text-gray-600'} transition-colors px-3`} title={t ? "Switch to light paper theme for daytime reading" : "Switch to dark theme for nighttime reading"}>
                                    {t ? <Sun size={14} /> : <Moon size={14} />}
                                </button>
                                {savedPosition > 5 && (
                                    <>
                                        <div className="w-[1px] h-4 bg-gray-500/20" />
                                        <button onClick={restorePosition} className={`p-2 rounded-full ${t ? 'hover:bg-white/10 text-yellow-400' : 'hover:bg-black/10 text-yellow-600'} transition-colors px-3`} title={`Resume reading where you left off at ${Math.round(savedPosition)}% - This bookmark automatically appears when you return to articles you've partially read`}>
                                            <BookmarkCheck size={14} />
                                        </button>
                                    </>
                                )}
                                <div className="w-[1px] h-4 bg-gray-500/20" />
                                <button onClick={() => setShowKeyboardHelp(!showKeyboardHelp)} className={`p-2 rounded-full ${t ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/10 text-gray-600'} transition-colors px-3`} title="Show keyboard shortcuts for reading controls">
                                    <HelpCircle size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Editor Content Area */}
                        <div className="relative text-base md:text-lg lg:text-xl transition-all duration-300" style={{ fontSize: `${fontSize}rem` }}>
                            <EditorContent editor={editor} />
                        </div>

                        {/* Footer Share */}
                        <div className={`mt-16 pt-8 border-t ${t ? 'border-white/10' : 'border-black/10'} flex flex-col sm:flex-row items-center justify-between gap-6`}>
                            <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                                END OF INTELLIGENCE REPORT
                            </div>
                            <button onClick={handleShare} className={`flex items-center gap-3 px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${t ? 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-white/10' : 'bg-black/5 hover:bg-black/10 text-gray-700 hover:text-black border-black/10'} border`}>
                                <Share size={16} /> Secure Share Link
                            </button>
                        </div>
                    </div>
                </div>

                {/* Global Styles injected for scoped viewing */}
                <style dangerouslySetInnerHTML={{
                    __html: `
            html { scroll-behavior: smooth; }
            
            /* Force custom cursor everywhere and prevent default cursor */
            * {
                cursor: none !important;
            }
            
            /* Override for specific interactive elements that need pointer behavior */
            button, a, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"]) {
                cursor: none !important;
            }
            
            /* Ensure text selection still works */
            .tiptap-editor-readonly p, .tiptap-editor-readonly h1, .tiptap-editor-readonly h2, .tiptap-editor-readonly h3, .tiptap-editor-readonly li, .tiptap-editor-readonly blockquote {
                cursor: none !important;
            }
            
            /* Drop Caps Styling */
            .drop-caps-enabled .tiptap-editor-readonly p:first-of-type:first-letter {
                float: left;
                font-size: 4em;
                line-height: 0.8;
                padding-right: 8px;
                padding-top: 4px;
                font-weight: 900;
                font-family: serif;
                margin-bottom: -6px;
                cursor: none !important;
            }
            
            .theme-dark.drop-caps-enabled .tiptap-editor-readonly p:first-of-type:first-letter {
                color: #dc2626;
                text-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
            }
            
            .theme-light.drop-caps-enabled .tiptap-editor-readonly p:first-of-type:first-letter {
                color: #991b1b;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .theme-dark .tiptap-editor-readonly { color: #d1d5db; }
            .theme-dark .tiptap-editor-readonly p { margin-bottom: 1.5em; line-height: 1.8; }
            .theme-dark .tiptap-editor-readonly h1 { font-size: 2.2em; font-weight: 900; margin-top: 1.5em; margin-bottom: 0.8em; color: #fff; letter-spacing: -0.02em; }
            .theme-dark .tiptap-editor-readonly h2 { font-size: 1.6em; font-weight: 800; margin-top: 1.5em; margin-bottom: 0.8em; color: #f3f4f6; letter-spacing: -0.01em; }
            .theme-dark .tiptap-editor-readonly h3 { font-size: 1.25em; font-weight: 700; margin-top: 1.2em; margin-bottom: 0.8em; color: #e5e7eb; }
            .theme-dark .tiptap-editor-readonly ul, .theme-dark .tiptap-editor-readonly ol { padding-left: 1.5em; margin-bottom: 1.5em; color: #9ca3af; }
            .theme-dark .tiptap-editor-readonly blockquote { border-left: 4px solid #991b1b; background: rgba(153, 27, 27, 0.05); padding: 1em 1.5em; margin-left: 0; margin-bottom: 1.5em; font-style: italic; color: #9ca3af; border-radius: 0 0.5em 0.5em 0; }
            .theme-dark .tiptap-editor-readonly code { background-color: #1f2937; padding: 0.2em 0.4em; border-radius: 4px; font-family: monospace; font-size: 0.9em; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1); }
            .theme-dark .tiptap-editor-readonly pre { background-color: #111827; padding: 1.5em; border-radius: 8px; overflow-x: auto; font-family: monospace; margin-bottom: 1.5em; border: 1px solid rgba(255,255,255,0.05); color: #e5e7eb; }
            .theme-dark .tiptap-editor-readonly a { color: #f87171; text-decoration: underline; text-underline-offset: 4px; transition: color 0.2s; }
            .theme-dark .tiptap-editor-readonly a:hover { color: #ef4444; }
            .theme-dark .tiptap-image { border-color: rgba(255,255,255,0.1); }
            .theme-dark .tiptap-youtube { border-color: rgba(255,255,255,0.1); }

            .theme-light .tiptap-editor-readonly { color: #374151; }
            .theme-light .tiptap-editor-readonly p { margin-bottom: 1.5em; line-height: 1.8; color: #374151; }
            .theme-light .tiptap-editor-readonly h1 { font-size: 2.2em; font-weight: 900; margin-top: 1.5em; margin-bottom: 0.8em; color: #111827; letter-spacing: -0.02em; }
            .theme-light .tiptap-editor-readonly h2 { font-size: 1.6em; font-weight: 800; margin-top: 1.5em; margin-bottom: 0.8em; color: #1f2937; letter-spacing: -0.01em; }
            .theme-light .tiptap-editor-readonly h3 { font-size: 1.25em; font-weight: 700; margin-top: 1.2em; margin-bottom: 0.8em; color: #374151; }
            .theme-light .tiptap-editor-readonly ul, .theme-light .tiptap-editor-readonly ol { padding-left: 1.5em; margin-bottom: 1.5em; color: #4b5563; }
            .theme-light .tiptap-editor-readonly blockquote { border-left: 4px solid #dc2626; background: rgba(220, 38, 38, 0.05); padding: 1em 1.5em; margin-left: 0; margin-bottom: 1.5em; font-style: italic; color: #4b5563; border-radius: 0 0.5em 0.5em 0; }
            .theme-light .tiptap-editor-readonly code { background-color: #f3f4f6; padding: 0.2em 0.4em; border-radius: 4px; font-family: monospace; font-size: 0.9em; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1); color: #1f2937; }
            .theme-light .tiptap-editor-readonly pre { background-color: #f8fafc; padding: 1.5em; border-radius: 8px; overflow-x: auto; font-family: monospace; margin-bottom: 1.5em; border: 1px solid rgba(0,0,0,0.1); color: #1e293b; }
            .theme-light .tiptap-editor-readonly a { color: #dc2626; text-decoration: underline; text-underline-offset: 4px; transition: color 0.2s; }
            .theme-light .tiptap-editor-readonly a:hover { color: #991b1b; }
            .theme-light .tiptap-image { border-color: rgba(0,0,0,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
            .theme-light .tiptap-youtube { border-color: rgba(0,0,0,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
            
            .tiptap-editor-readonly ul { list-style-type: disc; }
            .tiptap-editor-readonly ol { list-style-type: decimal; }
            .tiptap-editor-readonly pre code { background-color: transparent; padding: 0; box-shadow: none; border: none; color: inherit; }
            
            /* Heading Anchors */
            .heading-with-anchor { position: relative; scroll-margin-top: 100px; }
          `}} />
            </div>
        </div>
    )
}
