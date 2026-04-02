import { logout } from './login/actions'
import Link from 'next/link'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="w-full relative z-20 tracking-wide">
            <header className="mb-8 border-b border-gray-800/50 bg-[#141414]/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between font-mono sticky top-16 md:top-20 z-40 rounded-sm">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="text-red-700 font-bold uppercase tracking-widest text-sm hover:text-red-500 transition-colors drop-shadow-[0_0_5px_rgba(139,0,0,0.5)]">
                        Database Admin
                    </Link>
                    <span className="text-gray-700">|</span>
                    <Link href="/field-notes" className="text-gray-400 text-xs hover:text-gray-200 transition-colors uppercase">
                        View Field Notes
                    </Link>
                </div>
                <form action={logout}>
                    <button className="text-[10px] text-gray-400 border border-gray-800 px-3 py-1.5 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/50 transition-colors uppercase tracking-widest rounded-sm">
                        Terminate Session
                    </button>
                </form>
            </header>
            <div className="w-full">
                {children}
            </div>
        </div>
    )
}
