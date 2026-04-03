'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Type, Moon, Sun, Clock, BookOpen, Quote } from 'lucide-react'

// Helper to calculate reading time
const calculateReadingTime = (text: string) => {
    const words = text.trim().split(/\s+/).length
    return Math.max(1, Math.ceil(words / 200)) // 200 words per minute
}

export default function FieldNoteClientRenderer({ content }: { content: any }) {
    const [progress, setProgress] = useState(0)
    const [readingTime, setReadingTime] = useState(0)
    const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([])
    const [theme, setTheme] = useState<'dark' | 'light'>('dark')
    const [fontSize, setFontSize] = useState<number>(1)
    
    const [showShareMenu, setShowShareMenu] = useState(false)
    const [sharePosition, setSharePosition] = useState({ top: 0, left: 0 })
    const [selectedText, setSelectedText] = useState('')

    const containerRef = useRef<HTMLDivElement>(null)

    const extensions = [
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

            // Pass 1: Extract definitions
            paragraphs.forEach(p => {
                const text = p.textContent?.trim() || ''
                const match = text.match(/^\[(\d+)\]\s+(.+)$/)
                if (match) {
                    definitions.set(match[1], match[2])
                    // Optionally fade out the definition paragraph since it's now a tooltip
                    ;(p as HTMLElement).style.opacity = '0.4'
                    ;(p as HTMLElement).style.fontSize = '0.8em'
                }
            })

            // Pass 2: Decorate references
            paragraphs.forEach(p => {
                // Ignore if it already has footnote links to avoid infinite loop
                if (p.querySelector('.footnote-ref')) return
                
                let html = p.innerHTML
                if (html.match(/\[(\d+)\]/)) {
                    // Only match if it's NOT at the very start of the innerHTML (to avoid overriding the definition itself)
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

    // Progress Bar scroll listener
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            const totalHeight = rect.height
            const windowHeight = window.innerHeight
            
            // Calculate progress simply
            let pct = 0
            if (rect.top <= windowHeight) {
                const scrolled = Math.max(0, windowHeight - rect.top)
                pct = (scrolled / (totalHeight + windowHeight)) * 100
            }
            if (pct < 0) pct = 0
            if (pct > 100) pct = 100
            setProgress(pct)
        }
        window.addEventListener('scroll', handleScroll)
        handleScroll() // init
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Highlight Tooltip
    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection()
            if (!selection || selection.isCollapsed || selection.toString().trim().length === 0) {
                setShowShareMenu(false)
                return
            }
            
            const range = selection.getRangeAt(0)
            const rect = range.getBoundingClientRect()
            
            // Check if selection is within our wrapper
            if (containerRef.current?.contains(range.commonAncestorContainer)) {
                setSharePosition({
                    top: rect.top + window.scrollY - 50,
                    left: rect.left + rect.width / 2
                })
                setSelectedText(selection.toString().trim())
                setShowShareMenu(true)
            } else {
                setShowShareMenu(false)
            }
        }
        
        document.addEventListener('mouseup', handleSelection)
        return () => document.removeEventListener('mouseup', handleSelection)
    }, [])

    const handleShare = () => {
        const url = window.location.href
        const text = encodeURIComponent(`"${selectedText}" — Field Note Extract\n\n`)
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank')
        setShowShareMenu(false)
    }

    if (!content || Object.keys(content).length === 0) {
        return <div className="text-gray-600 font-mono italic">No intel has been recorded.</div>
    }

    const t = theme === 'dark'
    
    // Cycle font size: 1 -> 1.1 -> 1.2 -> 1
    const toggleFontSize = () => {
        setFontSize(prev => prev >= 1.2 ? 1 : prev + 0.1)
    }

    return (
        <div ref={containerRef} className={`mb-24 ${t ? 'bg-[#0a0a0a]/60 backdrop-blur-md border-white/5 shadow-2xl' : 'bg-[#fff5ee] border-gray-300 shadow-md'} rounded-3xl border relative group transition-all duration-700 font-sans theme-wrapper ${t ? 'theme-dark' : 'theme-light'}`}>
            
            {/* Reading Progress Indicator */}
            <div className={`absolute top-0 left-0 h-1 bg-red-600 rounded-t-3xl transition-all duration-150 z-30`} style={{ width: `${progress}%` }} />
            
            {/* Dark Mode Specific Decorations */}
            {t && (
                <>
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-900/20 to-transparent group-hover:via-red-500/40 transition-all duration-1000" />
                    <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-red-900/40 to-transparent -translate-y-1/2 rounded-r-md group-hover:h-48 group-hover:via-red-500/60 transition-all duration-700 delay-100" />
                </>
            )}

            {/* Share Tooltip */}
            <AnimatePresence>
                {showShareMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-50 bg-[#111] border border-red-900/50 shadow-[0_0_20px_rgba(220,38,38,0.3)] rounded-xl p-1 flex items-center -translate-x-1/2"
                        style={{ top: sharePosition.top, left: sharePosition.left }}
                    >
                        <button onClick={handleShare} className="text-white hover:bg-white/10 p-2 px-3 rounded-lg flex items-center gap-2 text-xs font-mono uppercase tracking-widest transition-colors">
                            <Quote size={14} className="text-red-400" /> Share Intel
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col lg:flex-row p-6 md:p-12 gap-12">
                
                {/* TOC Sidebar */}
                {toc.length > 0 && (
                    <div className="lg:w-48 xl:w-64 shrink-0 order-2 lg:order-1 border-t lg:border-t-0 lg:border-r pt-8 lg:pt-0 pr-0 lg:pr-8 border-gray-500/20 relative z-20">
                        <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
                            <h4 className={`text-[10px] font-mono uppercase tracking-[0.2em] mb-6 flex items-center gap-2 ${t ? 'text-gray-500' : 'text-gray-500'}`}>
                                <BookOpen size={14} className={t ? 'text-red-500' : 'text-red-600'} /> Auto-TOC
                            </h4>
                            <ul className="space-y-3 font-mono text-xs tracking-wider">
                                {toc.map((item) => (
                                    <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
                                        <a href={`#${item.id}`} className={`${t ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-700'} transition-colors inline-block line-clamp-2 leading-relaxed`}>
                                            <span className="opacity-50 mr-2">/</span>{item.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Main Content Pane */}
                <div className="flex-1 order-1 lg:order-2 min-w-0">
                    
                    {/* Reader Controls Toolbar */}
                    <div className={`flex flex-wrap items-center justify-between pb-6 mb-8 border-b ${t ? 'border-white/10' : 'border-black/10'} transition-colors relative z-20`}>
                        <div className="flex items-center gap-4 text-[10px] sm:text-xs font-mono uppercase tracking-widest w-full sm:w-auto mb-4 sm:mb-0">
                            <span className={`flex items-center gap-2 ${t ? 'text-gray-400' : 'text-gray-500'}`}>
                                <Clock size={14} className={t ? 'text-red-500' : 'text-red-600'} /> {readingTime} MIN READ
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-1 sm:gap-2 bg-black/5 rounded-full p-1 border border-black/5 dark:bg-white/5 dark:border-white/5 mx-auto sm:mx-0">
                            <button onClick={toggleFontSize} className={`p-2 rounded-full ${t ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/10 text-gray-600'} transition-colors flex items-center gap-1.5 px-3`} title="Adjust Font Size">
                                <Type size={14} /> <span className="text-[10px] font-mono leading-none">{fontSize.toFixed(1)}x</span>
                            </button>
                            <div className="w-[1px] h-4 bg-gray-500/20" />
                            <button onClick={() => setTheme(t ? 'light' : 'dark')} className={`p-2 rounded-full ${t ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/10 text-gray-600'} transition-colors px-3`} title={t ? "Switch to Paper View" : "Switch to Dark View"}>
                                {t ? <Sun size={14} /> : <Moon size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Editor Content Area */}
                    <div className="relative text-base md:text-lg lg:text-xl transition-all duration-300" style={{ fontSize: `${fontSize}rem` }}>
                        <EditorContent editor={editor} />
                    </div>

                </div>
            </div>

            {/* Global Styles injected for scoped viewing */}
            <style dangerouslySetInnerHTML={{
                __html: `
        html { scroll-behavior: smooth; }
        
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
    )
}
