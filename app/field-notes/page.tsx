import { createClient } from '@/lib/supabase/server'
import { CrimeTape } from '@/components/ui/CrimeTape'
import FieldNotesList from './FieldNotesList'

export const dynamic = 'force-dynamic'

export default async function FieldNotesIndex() {
    const supabase = await createClient()

    const { data: blogs } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 relative font-sans min-h-screen selection:bg-red-900/50 selection:text-white">
            {/* Background Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-red-900/5 blur-[120px] rounded-full" />
            </div>

            {/* Dynamic Crime Tape Overlay */}
            <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none z-40 h-64 opacity-80">
                <CrimeTape yPercent={2} rotation={-1.5} tension={0.2} />
                <CrimeTape yPercent={8} rotation={2} tension={0.4} />
            </div>

            {/* Hero Section */}
            <div className="relative mb-24 mt-12 flex flex-col items-center justify-center text-center">
                {/* Intense Glow behind title */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/10 blur-[80px] z-0 pointer-events-none rounded-full animate-pulse" />

                <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] z-10 mb-6 font-display">
                    Field Notes
                </h1>
                <p className="text-red-400 font-mono text-xs md:text-sm uppercase tracking-[0.4em] z-10 bg-black/60 px-8 py-3 rounded-full border border-red-900/50 backdrop-blur-md shadow-[0_0_20px_rgba(139,0,0,0.3)]">
                    Classified Archives // Level 4
                </p>
            </div>

            <FieldNotesList blogs={blogs || []} />
        </div>
    )
}
