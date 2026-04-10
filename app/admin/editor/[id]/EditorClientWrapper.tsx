'use client'

import { useState, useTransition, useCallback, useEffect } from 'react'
import { saveBlogContent } from './actions'
import { useEditor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Underline from '@tiptap/extension-underline'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { Image as ImageIcon, Video, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code, Bold, Italic, Strikethrough, Underline as UnderlineIcon, Palette } from 'lucide-react'

export default function EditorClientWrapper({ blog }: { blog: any }) {
    const [title, setTitle] = useState(blog.title)
    // Ensure we don't pass an empty object if there's no actual tiptap node content
    const [content, setContent] = useState<any>(
        blog.content && blog.content.type ? blog.content : undefined
    )
    const [isPending, startTransition] = useTransition()
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

    const editor = useEditor({
        content: content || null,
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            Placeholder.configure({
                placeholder: "Type '/' for commands or start typing intel...",
            }),
            Image.configure({
                inline: true,
                HTMLAttributes: {
                    class: 'rounded-xl border border-gray-700 max-w-full my-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]',
                },
            }),
            Youtube.configure({
                HTMLAttributes: {
                    class: 'w-full aspect-video rounded-xl border border-gray-700 my-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]',
                },
            }),
        ],
        editorProps: {
            attributes: {
                class: 'focus:outline-none min-h-[400px] prose-invert max-w-none text-base tiptap-editor outline-none',
            },
        },
        onUpdate: ({ editor }: any) => {
            setContent(editor.getJSON())
        }
    })

    const addImage = useCallback(() => {
        const url = window.prompt('URL of the image:')
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    const addVideo = useCallback(() => {
        const url = window.prompt('URL of the YouTube video:')
        if (url && editor) {
            editor.chain().focus().setYoutubeVideo({ src: url }).run()
        }
    }, [editor])

    const handleSave = () => {
        setSaveStatus('saving')
        startTransition(async () => {
            const result = await saveBlogContent(blog.id, title, content)
            if (result.success) {
                setSaveStatus('saved')
                setTimeout(() => setSaveStatus('idle'), 2000)
            } else {
                setSaveStatus('error')
            }
        })
    }

    // Ensure content binds correctly when editor spawns
    useEffect(() => {
        if (editor && content && editor.isEmpty) {
            editor.commands.setContent(content)
        }
    }, [editor, content])

    return (
        <div className="space-y-6 max-w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-transparent text-2xl md:text-4xl font-bold text-gray-200 focus:outline-none w-full placeholder-gray-700 font-display"
                    placeholder="ENTER TITLE..."
                />
                <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="shrink-0 bg-red-900/80 hover:bg-red-800 text-white font-mono uppercase text-[10px] tracking-widest py-3 px-8 shadow-[0_0_10px_rgba(139,0,0,0.2)] hover:shadow-[0_0_20px_rgba(139,0,0,0.5)] transition-all border border-red-900 disabled:opacity-50"
                >
                    {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save Intel'}
                </button>
            </div>

            <div className="bg-[#111] border border-gray-800 shadow-2xl text-gray-300 font-sans rounded-xl flex flex-col md:flex-row pt-0 relative">

                {/* Editor Toolbar */}
                {editor && (
                    <div className="md:order-2 shrink-0 md:w-16 border-b md:border-b-0 md:border-l border-gray-800 bg-[#0a0a0a]/50 flex flex-col">
                        <div className="p-2 flex md:flex-col items-center gap-1 sticky top-[72px] z-20 overflow-x-auto scrollbar-hide md:py-4 backdrop-blur-md">
                            <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded-lg hover:bg-gray-800 transition-colors shrink-0 ${editor.isActive('heading', { level: 1 }) ? 'text-red-400 bg-red-900/10' : 'text-gray-400'}`} title="Heading 1"><Heading1 size={18} /></button>
                            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded-lg hover:bg-gray-800 transition-colors shrink-0 ${editor.isActive('heading', { level: 2 }) ? 'text-red-400 bg-red-900/10' : 'text-gray-400'}`} title="Heading 2"><Heading2 size={18} /></button>
                            <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded-lg hover:bg-gray-800 transition-colors shrink-0 ${editor.isActive('heading', { level: 3 }) ? 'text-red-400 bg-red-900/10' : 'text-gray-400'}`} title="Heading 3"><Heading3 size={18} /></button>
                            <div className="w-px h-6 md:w-6 md:h-px bg-gray-800 mx-2 md:mx-0 md:my-1 shrink-0" />
                            <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-lg hover:bg-gray-800 transition-colors shrink-0 ${editor.isActive('bold') ? 'text-red-400 bg-red-900/10' : 'text-gray-400'}`} title="Bold"><Bold size={18} /></button>
                            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-lg hover:bg-gray-800 transition-colors shrink-0 ${editor.isActive('italic') ? 'text-red-400 bg-red-900/10' : 'text-gray-400'}`} title="Italic"><Italic size={18} /></button>
                            <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded-lg hover:bg-gray-800 transition-colors shrink-0 ${editor.isActive('underline') ? 'text-red-400 bg-red-900/10' : 'text-gray-400'}`} title="Underline"><UnderlineIcon size={18} /></button>
                            <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-2 rounded-lg hover:bg-gray-800 transition-colors shrink-0 ${editor.isActive('strike') ? 'text-red-400 bg-red-900/10' : 'text-gray-400'}`} title="Strike"><Strikethrough size={18} /></button>
                            <button onClick={() => editor.chain().focus().toggleCode().run()} className={`p-2 rounded-lg hover:bg-gray-800 transition-colors shrink-0 ${editor.isActive('code') ? 'text-red-400 bg-red-900/10' : 'text-gray-400'}`} title="Code"><Code size={18} /></button>
                            <div className="w-px h-6 md:w-6 md:h-px bg-gray-800 mx-2 md:mx-0 md:my-1 shrink-0" />
                            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded-lg hover:bg-gray-800 transition-colors shrink-0 ${editor.isActive('bulletList') ? 'text-red-400 bg-red-900/10' : 'text-gray-400'}`} title="Bullet List"><List size={18} /></button>
                            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded-lg hover:bg-gray-800 transition-colors shrink-0 ${editor.isActive('orderedList') ? 'text-red-400 bg-red-900/10' : 'text-gray-400'}`} title="Ordered List"><ListOrdered size={18} /></button>
                            <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded-lg hover:bg-gray-800 transition-colors shrink-0 ${editor.isActive('blockquote') ? 'text-red-400 bg-red-900/10' : 'text-gray-400'}`} title="Quote"><Quote size={18} /></button>
                            <div className="w-px h-6 md:w-6 md:h-px bg-gray-800 mx-2 md:mx-0 md:my-1 shrink-0" />
                            <button onClick={addImage} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-green-400 transition-colors shrink-0" title="Insert Image"><ImageIcon size={18} /></button>
                            <button onClick={addVideo} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-blue-400 transition-colors shrink-0" title="Insert Video"><Video size={18} /></button>
                        </div>
                    </div>
                )}

                <div className="flex-1 p-6 md:p-10 min-h-[500px] relative md:order-1 min-w-0">
                    {editor && (
                        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex gap-1 bg-[#1a1a1a] p-1.5 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.8)] border border-gray-700 backdrop-blur-md items-center">
                            <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded ${editor.isActive('bold') ? 'bg-red-900/50 text-white' : 'hover:bg-gray-800 text-gray-400 hover:text-white'}`}><Bold size={16} /></button>
                            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded ${editor.isActive('italic') ? 'bg-red-900/50 text-white' : 'hover:bg-gray-800 text-gray-400 hover:text-white'}`}><Italic size={16} /></button>
                            <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-1.5 rounded ${editor.isActive('underline') ? 'bg-red-900/50 text-white' : 'hover:bg-gray-800 text-gray-400 hover:text-white'}`}><UnderlineIcon size={16} /></button>
                            <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-1.5 rounded ${editor.isActive('strike') ? 'bg-red-900/50 text-white' : 'hover:bg-gray-800 text-gray-400 hover:text-white'}`}><Strikethrough size={16} /></button>
                            
                            <div className="w-px h-4 bg-gray-700 mx-1" />
                            <button onClick={() => editor.chain().focus().setColor('#ef4444').run()} className="w-5 h-5 rounded-full bg-[#ef4444] border-2 border-transparent hover:border-white transition-all ml-0.5" title="Red"></button>
                            <button onClick={() => editor.chain().focus().setColor('#3b82f6').run()} className="w-5 h-5 rounded-full bg-[#3b82f6] border-2 border-transparent hover:border-white transition-all mx-0.5" title="Blue"></button>
                            <button onClick={() => editor.chain().focus().setColor('#22c55e').run()} className="w-5 h-5 rounded-full bg-[#22c55e] border-2 border-transparent hover:border-white transition-all mx-0.5" title="Green"></button>
                            <button onClick={() => editor.chain().focus().setColor('#eab308').run()} className="w-5 h-5 rounded-full bg-[#eab308] border-2 border-transparent hover:border-white transition-all mx-0.5" title="Yellow"></button>
                            
                            <label className="cursor-pointer flex items-center justify-center p-1.5 rounded hover:bg-gray-800 transition-colors ml-0.5" title="Custom Color">
                                <input 
                                    type="color" 
                                    className="opacity-0 w-0 h-0 absolute"
                                    onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
                                    value={editor.getAttributes('textStyle').color || '#ffffff'}
                                />
                                <Palette size={16} className="text-gray-400 hover:text-white" style={{ color: editor.getAttributes('textStyle').color }} />
                            </label>
                            
                            <button onClick={() => editor.chain().focus().unsetColor().run()} className="p-1 rounded text-[10px] uppercase font-mono text-gray-500 hover:text-white hover:bg-gray-800 mx-0.5 tracking-widest" title="Clear Color">Clear</button>
                        </BubbleMenu>
                    )}

                    {editor && (
                        <FloatingMenu editor={editor} tippyOptions={{ duration: 100, placement: 'right' }} className="flex flex-col gap-1 bg-[#1a1a1a]/95 backdrop-blur-md p-2 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-gray-700 translate-x-12 min-w-[160px]">
                            <span className="text-[10px] uppercase font-mono text-gray-500 mb-1 px-2 mt-1">Add Block</span>
                            <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-xl text-gray-300 hover:text-white text-sm transition-colors"><Heading1 size={16} /> Heading 1</button>
                            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-xl text-gray-300 hover:text-white text-sm transition-colors"><Heading2 size={16} /> Heading 2</button>
                            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-xl text-gray-300 hover:text-white text-sm transition-colors"><List size={16} /> List</button>
                            <button onClick={addImage} className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-xl text-gray-300 hover:text-white text-sm transition-colors"><ImageIcon size={16} className="text-green-500" /> Image</button>
                            <button onClick={addVideo} className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-xl text-gray-300 hover:text-white text-sm transition-colors"><Video size={16} className="text-blue-500" /> YouTube</button>
                        </FloatingMenu>
                    )}

                    <EditorContent editor={editor} />
                </div>
            </div>

            {/* Global styles for Tiptap elements */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .tiptap-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #4b5563;
          pointer-events: none;
          height: 0;
        }
        .tiptap-editor p { margin-bottom: 1em; line-height: 1.7; }
        .tiptap-editor h1 { font-size: 2.2em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; color: #f3f4f6; }
        .tiptap-editor h2 { font-size: 1.6em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; color: #f3f4f6; }
        .tiptap-editor h3 { font-size: 1.25em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; color: #f3f4f6; }
        .tiptap-editor ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
        .tiptap-editor ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
        .tiptap-editor blockquote { border-left: 4px solid #991b1b; background: rgba(153, 27, 27, 0.05); padding: 1em 1.5em; margin-left: 0; font-style: italic; color: #9ca3af; border-radius: 4px; }
        .tiptap-editor code { background-color: #1f2937; padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; font-size: 0.9em; border: 1px solid rgba(255,255,255,0.1); }
        .tiptap-editor pre { background-color: #000; padding: 1em; border-radius: 8px; overflow-x: auto; font-family: monospace; border: 1px solid rgba(255,255,255,0.1); }
        .tiptap-editor pre code { background-color: transparent; padding: 0; border: none; }
        .ProseMirror-focused { outline: none !important; }
      `}} />
        </div>
    )
}
