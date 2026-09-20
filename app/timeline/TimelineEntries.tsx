'use client'

import { motion } from 'framer-motion'

const TIMELINE = [
    { date: "OCT 2025 - PRESENT", event: "RONIN GLOBAL", desc: "Creating AI driven full stack apps and crafting the future of marketing and Advertisement", status: "ACTIVE", type: "CRITICAL" },
    { date: "APR 2025 - SEP 2025", event: "BOXSY", desc: "Full stack development using next.js and python and AI to build a modern web solutions.", status: "RESOLVED", type: "MAJOR" },
    { date: "OCT 2024 - PRESENT", event: "GDG Lead at Google Developers Group", desc: "As a GDG Lead, I serve as a community organizer and ecosystem builder, officially recognized by Google Developers.", status: "ACTIVE", type: "MAJOR" },
    { date: "JAN 2024 - JUL 2024", event: "Full Stack Developer at Malefia", desc: "Building a full stack application for a local brand.", status: "RESOLVED", type: "MAJOR" },
    { date: "OCT 2023 - OCT 2025", event: "Full stack developer at M.A.D technology", desc: "Building a full stack application for a local startup.", status: "RESOLVED", type: "MAJOR" },
    { date: "MAR 2023 - OCT 2025", event: "Head of Education at A2SV", desc: "To educate the next generation in the world of computer science.", status: "RESOLVED", type: "MAJOR" },
    { date: "OCT 2022- JUL 2024", event: "Full Stack Developer at Chakka", desc: "Worked on a full stack application for a local brand.", status: "RESOLVED", type: "MAJOR" },
    { date: "SEP 2022-SEP 2026", event: "Computer Science Degree", desc: "Enrolled in University. Learned the theory behind the madness.", status: "COMPLETED", type: "INTEL" },
    { date: "MAR 2019", event: "First Freelance Gig", desc: "Built a WordPress site for a local bakery. Paid in croissants.", status: "ARCHIVED", type: "MINOR" },
    { date: "JUN 2018", event: "Discovered Programming", desc: "First encounter with Python. The obsession began.", status: "ARCHIVED", type: "ORIGIN" },
];

export function TimelineEntries() {
    return (
        <div className="relative space-y-8 pl-6">
            {TIMELINE.map((item, index) => (
                <motion.div
                    key={item.date}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                    className={`group relative border border-white/5 p-5 transition-all cursor-default z-10 shadow-lg ${item.status === 'ACTIVE'
                        ? 'bg-green-950/20 hover:bg-green-900/30 hover:border-green-500/30'
                        : 'bg-[#121212] hover:border-accent-red/30 hover:bg-accent-red/5'
                        }`}
                >
                    {/* Connection Line to String */}
                    <div className={`absolute left-[-24px] top-1/2 w-6 h-px transition-colors ${item.status === 'ACTIVE' ? 'bg-green-600/40 group-hover:bg-green-500' : 'bg-red-600/40 group-hover:bg-red-600'
                        }`} />

                    <div className="flex justify-start items-start mb-3">
                        <span className={`font-display text-lg font-bold tracking-tighter drop-shadow-[0_0_8px_rgba(255,0,0,0.6)] ${item.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'
                            }`}>
                            {item.date}
                        </span>
                    </div>

                    <h3 className="text-white font-display text-base uppercase tracking-wider mb-2 group-hover:text-accent-red transition-colors leading-none">
                        {item.event}
                    </h3>

                    <p className="text-gray-500 font-sans text-xs leading-relaxed italic opacity-80">
                        "{item.desc}"
                    </p>

                    {/* ID Ticker */}
                    <div className="mt-4 pt-2 border-t border-white/5 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                        <span className="font-mono text-[8px] text-gray-600 uppercase">REF:00{index + 1}</span>
                        <span className="font-mono text-[8px] text-gray-600 uppercase tracking-tighter">TYPE:{item.type}</span>
                    </div>

                    {/* Active Pulse Indicator */}
                    {item.status === 'ACTIVE' && (
                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-6 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,1)] z-20" />
                    )}
                </motion.div>
            ))}
        </div>
    )
}
