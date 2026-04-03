'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import { useEffect } from 'react'

export default function FieldNoteClientRenderer({ content }: { content: any }) {
    const extensions = [
        StarterKit,
        Image.configure({
            HTMLAttributes: {
                class: 'rounded-xl border border-white/10 w-full max-w-full my-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] object-cover',
            },
        }),
        Youtube.configure({
            HTMLAttributes: {
                class: 'w-full aspect-video rounded-xl border border-white/10 my-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]',
            },
        }),
    ]

    const editor = useEditor({
        editable: false,
        content: content || null,
        extensions,
        editorProps: {
            attributes: {
                class: 'prose-invert max-w-none tiptap-editor-readonly outline-none',
            },
        },
    })

    useEffect(() => {
        if (editor && content) {
            editor.commands.setContent(content)
        }
    }, [editor, content])

    if (!content || Object.keys(content).length === 0) {
        return <div className="text-gray-600 font-mono italic">No intel has been recorded.</div>
    }

    return (
        <div className="text-gray-300 font-sans leading-relaxed text-lg">
            <EditorContent editor={editor} />
            <style dangerouslySetInnerHTML={{
                __html: `
        .tiptap-editor-readonly p { margin-bottom: 1.5em; line-height: 1.8; }
        .tiptap-editor-readonly h1 { font-size: 2.2em; font-weight: 900; margin-top: 1.5em; margin-bottom: 0.8em; color: #fff; letter-spacing: -0.02em; }
        .tiptap-editor-readonly h2 { font-size: 1.6em; font-weight: 800; margin-top: 1.5em; margin-bottom: 0.8em; color: #f3f4f6; letter-spacing: -0.01em; }
        .tiptap-editor-readonly h3 { font-size: 1.25em; font-weight: 700; margin-top: 1.2em; margin-bottom: 0.8em; color: #e5e7eb; }
        .tiptap-editor-readonly ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1.5em; color: #d1d5db; }
        .tiptap-editor-readonly ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1.5em; color: #d1d5db; }
        .tiptap-editor-readonly li { margin-bottom: 0.5em; }
        .tiptap-editor-readonly blockquote { border-left: 4px solid #991b1b; background: rgba(153, 27, 27, 0.05); padding: 1em 1.5em; margin-left: 0; margin-bottom: 1.5em; font-style: italic; color: #9ca3af; border-radius: 0 0.5em 0.5em 0; }
        .tiptap-editor-readonly code { background-color: #1f2937; padding: 0.2em 0.4em; border-radius: 4px; font-family: monospace; font-size: 0.9em; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1); }
        .tiptap-editor-readonly pre { background-color: #111827; padding: 1.5em; border-radius: 8px; overflow-x: auto; font-family: monospace; margin-bottom: 1.5em; border: 1px solid rgba(255,255,255,0.05); }
        .tiptap-editor-readonly pre code { background-color: transparent; padding: 0; box-shadow: none; border: none; }
        .tiptap-editor-readonly a { color: #f87171; text-decoration: underline; text-underline-offset: 4px; transition: color 0.2s; }
        .tiptap-editor-readonly a:hover { color: #ef4444; }
      `}} />
        </div>
    )
}
