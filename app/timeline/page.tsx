import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/FadeIn";
import { ScanLine } from "@/components/ui/ScanLine";
import { GithubHeatmap } from "@/components/ui/GithubHeatmap";
import { TimelineEntries } from "./TimelineEntries";
import { Terminal, Activity, ShieldAlert, Monitor, Fingerprint } from "lucide-react";

export const metadata: Metadata = {
    title: "Chronology — Brook Solomon",
    description: "Career timeline and GitHub activity log for Brook Solomon: work history, education, and contribution record.",
};

export default function TimelinePage() {
    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen max-w-7xl">
            {/* Header */}
            <header className="mb-12 relative overflow-hidden">
                <FadeIn
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-start justify-start"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-px w-12 bg-accent-red opacity-50" />
                        <span className="text-accent-red font-mono text-[10px] uppercase tracking-[0.5em] opacity-80">
                            Deep_Archive // System_Logs
                        </span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-display text-white mb-2 tracking-tighter">
                        CHRONOLOGY
                    </h1>
                    <div className="flex items-center gap-6 mt-2 text-paper-yellow/40 font-mono text-[10px] uppercase tracking-widest">
                        <span>Terminal: 0x404</span>
                        <span>Status: Online</span>
                        <span>Connection: Secured</span>
                    </div>
                </FadeIn>

                {/* Background Grid Pattern */}
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(#8b0000 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative pb-20">

                {/* Left Column: History Log (3/12 - 25%) */}
                <aside className="lg:col-span-3 space-y-6 relative">
                    {/* The Red String (Vertical Line) */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-red-600/60 z-0 shadow-[0_0_10px_rgba(255,0,0,0.3)]" />

                    <div className="border-l-4 border-accent-red pl-4 mb-10">
                        <h2 className="text-xl font-display text-paper-yellow uppercase tracking-tight">Access Logs</h2>
                        <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">Temporal Sequence</p>
                    </div>

                    <TimelineEntries />

                    <div className="pt-12 opacity-10 hidden lg:block filter grayscale">
                        <Fingerprint className="w-16 h-16 text-white" />
                        <div className="font-mono text-[8px] text-gray-500 mt-2 space-y-1 uppercase tracking-widest">
                            <p>Authorized access only</p>
                            <p>Tracking enabled</p>
                        </div>
                    </div>
                </aside>

                {/* Right Column: GitHub & Analysis (9/12 - 75%) */}
                <main className="lg:col-span-9 space-y-8">

                    {/* Activity Monitor Section */}
                    <section className="relative">
                        <div className="flex items-center justify-between mb-6 px-2">
                            <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5 text-accent-red animate-pulse" />
                                <h2 className="text-3xl font-display text-white uppercase tracking-tighter italic">Live Surveillance Feed</h2>
                            </div>
                            <div className="flex gap-4">
                                <div className="hidden sm:flex items-center gap-2 border border-white/10 px-4 py-1.5 bg-black/40 rounded-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">Uplink: Stable</span>
                                </div>
                                <div className="flex items-center gap-2 border border-white/10 px-4 py-1.5 bg-black/40 rounded-sm">
                                    <Monitor className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">GitHub_Uptime</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0a0a0a] border border-white/10 p-4 md:py-12 md:px-4 relative overflow-hidden shadow-2xl rounded-sm">
                            {/* Scanning Line UI Decoration */}
                            <ScanLine />

                            {/* Heatmap Container */}
                            <div className="relative z-10 w-full flex justify-center py-12 md:py-20 bg-[#080808] backdrop-blur-md border border-white/5 shadow-inner min-h-[400px]">
                                <GithubHeatmap username="brooksolomon" />

                                {/* Corner Brackets for Scanner look */}
                                <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-accent-red/20" />
                                <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-accent-red/20" />
                                <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-accent-red/20" />
                                <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-accent-red/20" />
                            </div>

                            {/* Replaced Cards with Investigation Summary */}
                            <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                                <div className="lg:col-span-3 bg-accent-red/[0.03] border border-accent-red/20 p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group rounded-sm">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <ShieldAlert className="w-4 h-4 text-accent-red" />
                                            <h3 className="text-accent-red font-display text-2xl uppercase italic tracking-tighter">Investigation Summary</h3>
                                        </div>
                                        <p className="text-gray-400 font-sans text-sm leading-relaxed max-w-2xl uppercase font-bold tracking-wide mb-2 opacity-90">
                                            The subject exhibits highly focused creative output. Contribution frequency remains consistent
                                            throughout operational hours. No significant security breaches reported.
                                        </p>
                                        <div className="flex items-center gap-2 mt-4">
                                            <span className="text-white text-xs font-mono bg-accent-red px-2 py-0.5">STATUS:</span>
                                            <span className="text-white text-xs font-mono animate-pulse">UNDER CONTINUOUS MONITORING</span>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0 relative z-10">
                                        <div className="w-28 h-28 border-4 border-accent-red/30 flex items-center justify-center p-3 opacity-60 group-hover:opacity-100 transition-opacity rotate-3">
                                            <div className="w-full h-full bg-accent-red/20 flex flex-col items-center justify-center text-accent-red font-black text-sm text-center leading-none">
                                                <span>TOP</span>
                                                <span>SECRET</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Background stylized numbers */}
                                    <div className="absolute inset-0 pointer-events-none text-white opacity-[0.03] font-mono text-6xl flex items-center justify-around select-none overflow-hidden">
                                        <span>0101</span><span>1010</span><span>1100</span>
                                    </div>
                                </div>

                                <div className="lg:col-span-1 bg-black/40 border border-white/10 p-8 flex flex-col justify-center items-center text-center relative rounded-sm group">
                                    <Terminal className="w-8 h-8 text-green-500 mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <div className="font-display text-white text-lg tracking-widest mb-1">DATA_SECURE</div>
                                    <div className="font-mono text-[9px] text-gray-500 uppercase">Verification Hash: 0xF72A</div>

                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <div className="w-1 h-3 bg-accent-red/30" />
                                        <div className="w-1 h-3 bg-accent-red/50" />
                                        <div className="w-1 h-3 bg-accent-red" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

            </div>
        </div>
    );
}
