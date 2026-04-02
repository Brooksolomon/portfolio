'use client'

import { useState, useTransition } from 'react'
import { saveBlogContent } from './actions'
import { EditorRoot, EditorContent } from 'novel'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

export default function EditorClientWrapper({ blog }: { blog: any }) {
    const [title, setTitle] = useState(blog.title)
    // Ensure we don't pass an empty object if there's no actual tiptap node content
    const [content, setContent] = useState<any>(
        blog.content && blog.content.type ? blog.content : undefined
    )
    const [isPending, startTransition] = useTransition()
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

    const extensions = [
        StarterKit,
        Placeholder.configure({
            placeholder: 'Type your field note here...'
        })
    ]

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

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-transparent text-2xl md:text-3xl font-bold text-gray-200 focus:outline-none w-full placeholder-gray-700 font-mono"
                    placeholder="ENTRY TITLE..."
                />
                <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="shrink-0 bg-red-900/80 hover:bg-red-800 text-white font-mono uppercase text-xs tracking-widest py-3 px-8 shadow-[0_0_10px_rgba(139,0,0,0.2)] hover:shadow-[0_0_20px_rgba(139,0,0,0.5)] transition-all border border-red-900 disabled:opacity-50"
                >
                    {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save to Database'}
                </button>
            </div>

            <div className="bg-[#141414]/90 border border-gray-800/80 p-6 min-h-[500px] shadow-inner text-gray-300 font-sans">
                <EditorRoot>
                    <EditorContent
                        initialContent={content}
                        extensions={extensions}
                        editorProps={{
                            attributes: {
                                class: 'focus:outline-none min-h-[400px] prose-invert max-w-none text-base tiptap-editor',
                            },
                        }}
                        onUpdate={({ editor }) => {
                            setContent(editor.getJSON())
                        }}
                    />
                </EditorRoot>
            </div>

            {/* Global styles for Tiptap elements to make it look decent without Tailwind Typography */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .tiptap-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #4b5563;
          pointer-events: none;
          height: 0;
        }
        .tiptap-editor p { margin-bottom: 1em; }
        .tiptap-editor h1 { font-size: 2em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; color: #f3f4f6; }
        .tiptap-editor h2 { font-size: 1.5em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; color: #f3f4f6; }
        .tiptap-editor h3 { font-size: 1.17em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; color: #f3f4f6; }
        .tiptap-editor ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
        .tiptap-editor ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
        .tiptap-editor blockquote { border-left: 3px solid #7f1d1d; padding-left: 1em; margin-left: 0; font-style: italic; color: #9ca3af; }
        .tiptap-editor code { background-color: #1f2937; padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; font-size: 0.9em; }
        .tiptap-editor pre { background-color: #111827; padding: 1em; border-radius: 5px; overflow-x: auto; font-family: monospace; }
        .tiptap-editor pre code { background-color: transparent; padding: 0; }
      `}} />
        </div>
    )
}
