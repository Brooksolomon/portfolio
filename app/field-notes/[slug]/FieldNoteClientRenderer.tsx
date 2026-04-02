'use client'

import { EditorRoot, EditorContent } from 'novel'
import StarterKit from '@tiptap/starter-kit'

export default function FieldNoteClientRenderer({ content }: { content: any }) {
    // If there's no content or it's empty, render a placeholder
    if (!content || Object.keys(content).length === 0) {
        return <div className="text-gray-600 font-mono italic">No intel has been recorded.</div>
    }

    return (
        <div className="text-gray-300 font-sans leading-relaxed text-lg">
            <EditorRoot>
                <EditorContent
                    initialContent={content}
                    extensions={[StarterKit]}
                    editable={false}
                    editorProps={{
                        attributes: {
                            class: 'prose-invert max-w-none tiptap-editor-readonly',
                        },
                    }}
                />
            </EditorRoot>
            <style dangerouslySetInnerHTML={{
                __html: `
        .tiptap-editor-readonly p { margin-bottom: 1.2em; }
        .tiptap-editor-readonly h1 { font-size: 2em; font-weight: bold; margin-top: 1.5em; margin-bottom: 0.5em; color: #fff; }
        .tiptap-editor-readonly h2 { font-size: 1.5em; font-weight: bold; margin-top: 1.5em; margin-bottom: 0.5em; color: #fff; }
        .tiptap-editor-readonly h3 { font-size: 1.17em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; color: #fff; }
        .tiptap-editor-readonly ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1.2em; }
        .tiptap-editor-readonly ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1.2em; }
        .tiptap-editor-readonly blockquote { border-left: 3px solid #7f1d1d; padding-left: 1em; margin-left: 0; font-style: italic; color: #9ca3af; margin-bottom: 1.2em; }
        .tiptap-editor-readonly code { background-color: #1f2937; padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; font-size: 0.9em; }
        .tiptap-editor-readonly pre { background-color: #111827; padding: 1em; border-radius: 5px; overflow-x: auto; font-family: monospace; margin-bottom: 1.2em; }
        .tiptap-editor-readonly pre code { background-color: transparent; padding: 0; }
        .tiptap-editor-readonly img { max-width: 100%; height: auto; border: 1px solid #374151; display: block; margin: 1em 0; }
      `}} />
        </div>
    )
}
