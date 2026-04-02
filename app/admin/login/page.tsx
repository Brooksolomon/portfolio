import { login } from './actions'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams;
    const error = resolvedSearchParams?.error as string | undefined;

    return (
        <div className="w-full flex items-center justify-center p-4 font-sans text-gray-200 mt-20">
            <div className="max-w-md w-full bg-[#1a1a1a]/90 backdrop-blur-sm p-8 border border-red-900/50 shadow-[0_0_40px_rgba(139,0,0,0.1)] relative group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-800 to-transparent opacity-50" />

                {/* Decorative elements */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-red-900/50" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-red-900/50" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-red-900/50" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-red-900/50" />

                <h1 className="text-3xl font-display text-accent-red tracking-widest text-center mb-2 uppercase drop-shadow-[0_0_10px_rgba(139,0,0,0.5)]">Restricted</h1>
                <p className="text-center text-gray-500 font-mono text-xs uppercase tracking-[0.2em] mb-8">
                    Admin Database Access
                </p>

                {error && (
                    <div className="bg-red-950/50 border border-red-900 text-red-400 p-3 mb-6 text-[11px] font-mono text-center uppercase tracking-wider relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600" />
                        {error}
                    </div>
                )}

                <form action={login} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
                            Agent Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full bg-[#0e0e0e]/80 border border-gray-800 p-3 text-gray-300 focus:outline-none focus:border-red-900 transition-colors font-mono text-sm placeholder-gray-700"
                            placeholder="classified@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
                            Passcode
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full bg-[#0e0e0e]/80 border border-gray-800 p-3 text-gray-300 focus:outline-none focus:border-red-900 transition-colors font-mono text-sm placeholder-gray-700"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-900/80 hover:bg-red-800 text-white font-mono uppercase tracking-widest text-sm py-4 mt-4 transition-colors border border-red-900 shadow-[0_0_15px_rgba(139,0,0,0.3)] hover:shadow-[0_0_25px_rgba(139,0,0,0.5)]"
                    >
                        Authenticate
                    </button>
                </form>
            </div>
        </div>
    )
}
