"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Polaroid } from "@/components/ui/Polaroid";
import { X, Search, Filter, ChevronLeft, ChevronRight, Github, ExternalLink } from "lucide-react";

// Mock Data
interface Project {
    id: number;
    title: string;
    type: string;
    images: string[];
    tech: string[];
    desc: string;
    date: string;
    github?: string;
    live?: string;
}

const EVIDENCE: Project[] = [
    {
        id: 1,
        title: "Totals",
        type: "Mobile App",
        images: ["/images/projects/totals/1.png", "/images/projects/totals/2.png", "/images/projects/totals/3.png", "/images/projects/totals/4.png",],
        tech: ["Flutter", "NextJs",],
        desc: "mobile app that automatically tracks your bank transactions by parsing SMS messages from Ethiopian banks. It gives you real-time balance updates, detailed transaction history, smart analytics, and clear financial insights, all stored securely on your device.",
        date: "2025-12-15",

        live: "https://totals.detached.space"
    },
    {
        id: 2,
        title: "The Binger",
        type: "Website",
        images: ["/images/projects/binger/1.png", "/images/projects/binger/2.png",],
        tech: ["Sveltekit", "Firebase", "Tailwind"],
        desc: "The binger is a movie streaming platform that lets you stream any movie in the world and also lets you track your watched movies on the website.",
        date: "2024-01-20",
        live: "https://the-binger.vercel.app"
    },
    {
        id: 3,
        title: "Opus",
        type: "Mobile App",
        images: ["/images/projects/opus/1.png", "/images/projects/opus/2.png", "/images/projects/opus/3.png"],
        tech: ["Flutter", "Supabase",],
        desc: "Music Without Limits Stream endlessly. Discover effortlessly. Experience music like never before.",
        date: "2025-06-23",
        live: "https://opus.detached.space"
    },
    {
        id: 4,
        title: "WebMTP",
        type: "Website",
        images: ["/images/projects/webmtp/1.png", "/images/projects/webmtp/2.png"],
        tech: ["NextJs", "Tailwind"],
        desc: "connect and directly access your phone storage from the web on MacOs without any installs.",
        date: "2024-02-05",
        live: "https://webmtp.detached.space",
        github: "https://github.com/detached-space/webmtp"
    },
    {
        id: 5,
        title: "Ora browser",
        type: "MacOs native app",
        images: ["/images/projects/ora/1.png"],
        tech: ["Swift", "MacOs SDK", "Webkit"],
        desc: "Ora is an open-source macOS browser built with Swift and WebKit. Fast, secure, and native Arc alternative that puts users first with smooth tab management, spaces, vertical sidebar, and many more.",
        date: "2025-09-08",
        live: "https://www.orabrowser.com/",
        github: "https://github.com/the-ora/browser"
    },
    {
        id: 6,
        title: "Chakka Origins",
        type: "Website",
        images: ["/images/projects/chakka/1.png", "/images/projects/chakka/2.png"],
        tech: ["Sveltekit", "Tailwind", "Firebase", "Express"],
        desc: "a shopping website for a company specializing in biodiverse Ethiopian natural products ,sustainably sourced from forest farmers, complete with delivery system and payment integration",
        date: "2024-03-12",
        live: "https://www.chakkaorigins.com/",
    },
    {
        id: 7,
        title: "Murder mystery portfolio",
        type: "Website",
        images: ["/images/projects/portfolio/1.png", "/images/projects/portfolio/2.png"],
        tech: ["NextJs", "Tailwind"],
        desc: "This website",
        date: "2026-01-30",
        live: "https://solocodes.dev",
        github: "https://github.com/brooksolomon/portfolio"
    },
    {
        id: 8,
        title: "Boxsy",
        type: "Website",
        images: ["/images/projects/boxsy/1.png", "/images/projects/boxsy/2.png"],
        tech: ["NextJs", "Tailwind", "Supabase", "Python", "SQL", "Knock", "Stripe"],
        desc: "your AI-powered fundraising operations system. Built to  speed up your raise, automate updates and keep investors engaged.",
        date: "2025-05-15",
        live: "https://www.boxsy.io/"
    },
];

export default function EvidencePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white font-mono uppercase tracking-widest">Initialising_Evidence_Stream...</div>}>
            <EvidenceContent />
        </Suspense>
    );
}

function EvidenceContent() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTechs, setActiveTechs] = useState<string[]>([]);
    const [isArchiveOpen, setIsArchiveOpen] = useState(false);
    const [fullscreenImageIndex, setFullscreenImageIndex] = useState<number | null>(null);

    const searchParams = useSearchParams();

    // Handle initial selection from URL
    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            const numId = parseInt(id);
            if (!isNaN(numId)) {
                setSelectedId(numId);
            }
        }
    }, [searchParams]);


    const { commonTechs, archivedTechs, allTechs } = useMemo(() => {
        const techs = new Set<string>();
        EVIDENCE.forEach(item => item.tech.forEach(t => techs.add(t.trim())));
        const all = Array.from(techs).sort();
        const commonList = ["NextJs", "Tailwind", "Flutter", "Supabase", "Python"].map(t => t.toLowerCase());

        return {
            allTechs: all,
            commonTechs: all.filter(t => commonList.includes(t.toLowerCase())),
            archivedTechs: all.filter(t => !commonList.includes(t.toLowerCase()))
        };
    }, []);

    const filteredEvidence = useMemo(() => {
        return EVIDENCE.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesTech = activeTechs.length === 0 ||
                activeTechs.every(tech => item.tech.includes(tech));

            return matchesSearch && matchesTech;
        });
    }, [searchQuery, activeTechs]);

    const selectedItem = EVIDENCE.find((e) => e.id === selectedId);

    // Keyboard Navigation for Fullscreen Viewer
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (fullscreenImageIndex === null || !selectedItem) return;

            if (e.key === "ArrowRight") {
                setFullscreenImageIndex((prev) =>
                    prev !== null ? (prev + 1) % selectedItem.images.length : null
                );
            } else if (e.key === "ArrowLeft") {
                setFullscreenImageIndex((prev) =>
                    prev !== null ? (prev - 1 + selectedItem.images.length) % selectedItem.images.length : null
                );
            } else if (e.key === "Escape") {
                setFullscreenImageIndex(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [fullscreenImageIndex, selectedItem]);

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8 relative min-h-screen">




            {/* Corkboard Background Effect */}
            <div className="fixed inset-0 z-[-1] opacity-40 mix-blend-overlay pointer-events-none"
                style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cork-board.png')" }}>
            </div>

            <div className="text-center mb-10 sm:mb-16 relative">
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="inline-block bg-[#f4e4bc] px-6 py-4 sm:px-12 sm:py-6 shadow-[10px_10px_20px_rgba(0,0,0,0.1)] transform -rotate-1 border border-[#d3c299] relative max-w-[calc(100vw-2rem)]"
                >
                    {/* Tape on top edges */}
                    <div className="absolute -top-4 left-1/4 w-12 h-6 sm:w-16 sm:h-8 bg-white/30 backdrop-blur-sm -rotate-3 shadow-sm border border-white/10" />
                    <div className="absolute -top-2 right-1/4 w-10 h-5 sm:w-12 sm:h-6 bg-white/20 backdrop-blur-sm rotate-6 shadow-sm border border-white/10" />

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-display text-red-950 drop-shadow-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-1">
                        Evidence Board
                    </h1>
                    <p className="text-gray-600 font-mono text-[10px] uppercase tracking-[0.4em] opacity-80">
                        Classified Archive // Case File #404-B
                    </p>
                </motion.div>
            </div>

            {/* Filter & Search UI */}
            <div className="max-w-5xl mx-auto mb-10 sm:mb-16 space-y-6">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start lg:items-center justify-between bg-black/5 p-4 sm:p-6 backdrop-blur-md border border-black/10 rounded-sm relative group z-[100]">
                    {/* Decorative tape on corners */}
                    <div className="absolute -top-1 -left-1 w-8 h-4 bg-black/5 rotate-[45deg] pointer-events-none" />
                    <div className="absolute -bottom-1 -right-1 w-8 h-4 bg-black/5 rotate-[45deg] pointer-events-none" />

                    {/* Search Bar */}
                    <div className="relative w-full lg:w-80 group/search">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within/search:text-red-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH EVIDENCE..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/50 border-b-2 border-black/20 focus:border-red-900 p-2 pl-10 font-mono text-sm text-black placeholder:text-gray-400 focus:outline-none transition-all focus:bg-white/80"
                        />
                    </div>

                    {/* Filter Groups */}
                    <div className="flex flex-wrap gap-8 items-center flex-1 justify-end font-mono">
                        {/* Tech Group */}
                        <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-3">
                            <div className="flex items-center gap-2 flex-wrap justify-end">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2 shrink-0">TECH STACK:</span>
                                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 justify-end">
                                    <button
                                        onClick={() => setActiveTechs([])}
                                        className={`relative px-3 py-1 text-[11px] transition-all group/btn ${activeTechs.length === 0 ? 'text-red-900 font-bold' : 'text-gray-500 hover:text-red-900'}`}
                                    >
                                        ALL TOOLS
                                        <div className={`absolute -bottom-1 left-0 h-[2px] bg-red-900/60 rounded-full transition-all duration-300 ${activeTechs.length === 0 ? 'w-full' : 'w-0 group-hover/btn:w-full'}`} />
                                    </button>
                                    {commonTechs.map(tech => (
                                        <button
                                            key={tech}
                                            onClick={() => {
                                                setActiveTechs(prev =>
                                                    prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
                                                );
                                            }}
                                            className={`relative px-3 py-1 text-[11px] transition-all group/btn ${activeTechs.includes(tech) ? 'text-red-900 font-bold' : 'text-gray-500 hover:text-red-900'}`}
                                        >
                                            {tech.toUpperCase()}
                                            <div className={`absolute -bottom-1 left-0 h-[2px] bg-red-900/60 rounded-full transition-all duration-300 ${activeTechs.includes(tech) ? 'w-full' : 'w-0 group-hover/btn:w-full'}`} />
                                        </button>
                                    ))}
                                    {archivedTechs.length > 0 && (
                                        <div className="relative inline-block ml-4">
                                            <button
                                                onClick={() => setIsArchiveOpen(!isArchiveOpen)}
                                                className={`px-3 py-1 text-[10px] font-mono border flex items-center gap-1 transition-all ${isArchiveOpen ? 'bg-red-900 text-white border-red-900' : 'bg-transparent text-gray-400 border-black/10 hover:border-red-900 hover:text-red-900'}`}
                                            >
                                                MORE <Filter className="w-3 h-3" />
                                            </button>

                                            <AnimatePresence>
                                                {isArchiveOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute right-0 top-full mt-2 w-64 bg-[#f8f5e9] border border-[#d3c299] shadow-[20px_20px_40px_rgba(0,0,0,0.2)] z-[110] p-4 origin-top-right"
                                                    >
                                                        <div className="text-[9px] font-bold text-gray-400 mb-2 border-b border-black/5 pb-1 uppercase tracking-widest text-center">Classified Technologies</div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {archivedTechs.length > 0 ? archivedTechs.map(tech => (
                                                                <button
                                                                    key={tech}
                                                                    onClick={() => {
                                                                        setActiveTechs(prev =>
                                                                            prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
                                                                        );
                                                                    }}
                                                                    className={`px-2 py-1.5 text-[10px] font-mono border text-left truncate transition-all ${activeTechs.includes(tech) ? 'bg-red-900 text-white border-red-900' : 'hover:bg-red-800/10 hover:border-red-900/30 text-gray-600'}`}
                                                                >
                                                                    {tech.toUpperCase()}
                                                                </button>
                                                            )) : (
                                                                <div className="col-span-2 text-center text-[9px] text-gray-400 py-4 uppercase">No additional assets found</div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid of Evidence (Scatter Layout) */}
            <motion.div
                layout
                className="flex flex-wrap justify-center gap-x-6 gap-y-16 sm:gap-x-12 sm:gap-y-28 relative pb-24 sm:pb-32"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: {
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
            >
                <AnimatePresence mode="popLayout">
                    {filteredEvidence.map((item, index) => {
                        const rotations = [-3, 1, -1.5, 4, -2.5, 2.5, -4, 3];
                        const rot = rotations[index % rotations.length];
                        return (
                            <motion.div
                                layout
                                variants={{
                                    hidden: { opacity: 0, y: 50, rotate: rot - 5, scale: 0.9 },
                                    visible: { opacity: 1, y: 0, rotate: rot, scale: 1 }
                                }}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                key={item.id}
                                className="relative group perspective-1000"
                                style={{
                                    marginTop: index % 3 === 0 ? '40px' : index % 3 === 1 ? '0px' : '20px',
                                }}
                            >
                                <Polaroid
                                    src={item.images[0]}
                                    alt={item.title}
                                    caption={item.title}
                                    rotation={rot}
                                    className="z-10 transition-all duration-500 ease-out group-hover:z-[40]"
                                    onClick={() => setSelectedId(item.id)}
                                />

                                {/* Physical Shadow Effect */}
                                <div className="absolute inset-0 bg-black/5 blur-xl -z-10 group-hover:bg-black/10 transition-all duration-500 translate-y-4 translate-x-2 rounded-full scale-90" />

                                {/* Tech Badges BELOW the Card */}
                                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-1.5 w-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 z-[50]">
                                    {item.tech.slice(0, 4).map((t, i) => (
                                        <motion.span
                                            key={t}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="bg-white px-2 py-1 text-[9px] font-mono border border-black/10 shadow-sm text-red-950 uppercase tracking-tighter"
                                        >
                                            {t}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {filteredEvidence.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full text-center py-20"
                    >
                        <p className="font-typewriter text-2xl text-red-950/40 uppercase tracking-widest">
                            No evidence found matching requested criteria.
                        </p>
                    </motion.div>
                )}
            </motion.div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {selectedId && selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedId(null)}
                    >
                        <motion.div
                            layoutId={`evidence-${selectedId}`}
                            className="bg-[#f0f0f0] text-black w-full max-w-4xl p-2 shadow-2xl rounded-sm overflow-hidden max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="border border-gray-300 p-4 sm:p-6 md:p-8 bg-white relative overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-red-900/20 scrollbar-track-transparent">
                                <button
                                    onClick={() => setSelectedId(null)}
                                    className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>

                                <h2 className="text-xl sm:text-2xl md:text-3xl font-display mb-2 border-b-2 border-red-800 inline-block text-red-900 break-words">
                                    INCIDENT REPORT: {selectedItem.title}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6 pb-8">
                                    <div className="space-y-6">
                                        {selectedItem.images.length > 1 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div
                                                    className="sm:col-span-2 relative bg-gray-200 border border-gray-300 p-2 shadow-lg transform rotate-1 hover:rotate-0 transition-all duration-500 group/img cursor-zoom-in overflow-hidden h-fit"
                                                    onClick={() => setFullscreenImageIndex(0)}
                                                >
                                                    <img
                                                        src={selectedItem.images[0]}
                                                        alt={`${selectedItem.title} 1`}
                                                        className="w-full h-auto grayscale border border-black/10 group-hover/img:grayscale-0 transition-all duration-500"
                                                    />
                                                    <div className="absolute top-3 right-3 bg-black/80 text-white text-[9px] px-2 py-0.5 font-mono uppercase tracking-tighter">
                                                        PRIMARY_FORENSIC_VIEW
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-1 grid grid-cols-2 sm:grid-cols-1 gap-3 content-start">
                                                    {selectedItem.images.slice(1).map((img, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`relative bg-gray-200 border border-gray-300 p-1.5 shadow-md transform ${idx % 2 === 0 ? '-rotate-2' : 'rotate-2'} hover:rotate-0 transition-all duration-300 group/img cursor-zoom-in`}
                                                            onClick={() => setFullscreenImageIndex(idx + 1)}
                                                        >
                                                            <img
                                                                src={img}
                                                                alt={`${selectedItem.title} ${idx + 2}`}
                                                                className="w-full aspect-square object-cover grayscale border border-black/10 group-hover/img:grayscale-0 transition-all duration-500"
                                                            />
                                                            <div className="absolute top-1 right-1 bg-black/80 text-white text-[7px] px-1 font-mono uppercase tracking-tighter">
                                                                FILE_{idx + 2}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className="relative bg-white/50 border border-gray-300 p-2 shadow-md transform rotate-1 hover:rotate-0 transition-all duration-500 group/img cursor-zoom-in"
                                                onClick={() => setFullscreenImageIndex(0)}
                                            >
                                                <img
                                                    src={selectedItem.images[0]}
                                                    alt={selectedItem.title}
                                                    className="w-full grayscale border border-black/10 group-hover/img:grayscale-0 transition-all duration-500"
                                                />
                                                <div className="absolute top-2 right-2 bg-black/80 text-white text-[8px] px-1 font-mono uppercase tracking-tighter">
                                                    SOLE_EXHIBIT
                                                </div>
                                            </div>
                                        )}
                                        <div className="text-[10px] font-mono text-gray-400 text-center mt-6 uppercase tracking-widest opacity-50">--- End of Forensic Documentation ---</div>
                                    </div>

                                    <div className="space-y-4 font-typewriter">
                                        <div>
                                            <h4 className="font-bold bg-black text-white inline-block px-1 mb-1 text-xs">DESCRIPTION</h4>
                                            <p className="text-sm leading-relaxed">{selectedItem.desc}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-bold bg-black text-white inline-block px-1 mb-1 text-xs">TOOLS USED</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedItem.tech.map(t => (
                                                    <span key={t} className="px-2 py-1 bg-[#f4e4bc] text-[10px] border border-[#d3c299] shadow-sm">{t.toUpperCase()}</span>
                                                ))}
                                            </div>
                                        </div>

                                        {(selectedItem.github || selectedItem.live) && (
                                            <div>
                                                <h4 className="font-bold bg-black text-white inline-block px-1 mb-1 text-xs">LINKS</h4>
                                                <div className="flex flex-col gap-2">
                                                    {selectedItem.live && (
                                                        <a
                                                            href={selectedItem.live}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 group/link text-sm hover:text-red-900 transition-colors w-fit underline decoration-black/20 underline-offset-4"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                            <span className="font-bold">LIVE_SITE.EXE</span>
                                                        </a>
                                                    )}
                                                    {selectedItem.github && (
                                                        <a
                                                            href={selectedItem.github}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 group/link text-sm hover:text-red-900 transition-colors w-fit underline decoration-black/20 underline-offset-4"
                                                        >
                                                            <Github className="w-4 h-4" />
                                                            <span className="font-bold">SOURCE_FILES.ZIP</span>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-4">
                                            <p className="text-xs text-red-700 font-bold uppercase border-2 border-red-700 inline-block p-1 transform -rotate-6">
                                                VERIFIED CASE ARTIFACT
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fullscreen Image Viewer */}
            <AnimatePresence>
                {fullscreenImageIndex !== null && selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-12"
                        onClick={() => setFullscreenImageIndex(null)}
                    >
                        <button
                            className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/50 hover:text-white transition-colors z-[2100] p-2 touch-manipulation"
                            onClick={() => setFullscreenImageIndex(null)}
                            aria-label="Close"
                        >
                            <X className="w-8 h-8 sm:w-10 sm:h-10" />
                        </button>

                        {/* Navigation Controls */}
                        {selectedItem.images.length > 1 && (
                            <>
                                <button
                                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-[2100] group"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFullscreenImageIndex((prev) =>
                                            prev !== null ? (prev - 1 + selectedItem.images.length) % selectedItem.images.length : null
                                        );
                                    }}
                                >
                                    <ChevronLeft className="w-16 h-16 transform group-hover:scale-110 transition-transform" />
                                </button>
                                <button
                                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-[2100] group"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFullscreenImageIndex((prev) =>
                                            prev !== null ? (prev + 1) % selectedItem.images.length : null
                                        );
                                    }}
                                >
                                    <ChevronRight className="w-16 h-16 transform group-hover:scale-110 transition-transform" />
                                </button>
                            </>
                        )}

                        <motion.div
                            key={fullscreenImageIndex}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-full max-h-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedItem.images[fullscreenImageIndex]}
                                alt="Evidence Focus"
                                className="max-w-full max-h-[85vh] object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)] border-4 border-white/10"
                            />

                            {/* Metadata Overlay */}
                            <div className="absolute -bottom-16 left-0 right-0 text-center font-mono">
                                <p className="text-white text-xs tracking-[0.5em] uppercase opacity-40 mb-1">Investigation Artifact</p>
                                <p className="text-red-600 font-bold uppercase tracking-widest">
                                    {selectedItem.title} // EXHIBIT {fullscreenImageIndex + 1}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
