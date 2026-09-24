"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { RedString } from "@/components/ui/RedString";
import { Polaroid } from "@/components/ui/Polaroid";
import { cn } from "@/lib/utils";
import { Skull, AlertTriangle, Shield, Zap, Search, Eye, Lock, Crosshair, Terminal, Activity, Fingerprint, Database, Cpu, Globe } from "lucide-react";

interface Skill {
    id: string;
    name: string;
    status: "CONFIRMED";
    capabilities: string[];
    proof?: {
        name: string;
        id: number;
    }[];
    threatLevel: number; // 1-5
    category: "WEAPONS" | "TOOLS" | "TACTICS";
}

const SKILLS: Skill[] = [
    {
        id: "ts",
        name: "TypeScript",
        status: "CONFIRMED",
        capabilities: ["Type-safe scalable systems", "Complex state management"],
        proof: [{ name: "Boxsy", id: 8 }, { name: "WebMTP", id: 4 }],
        threatLevel: 5,
        category: "WEAPONS",
    },
    {
        id: "nextjs",
        name: "Next.js",
        status: "CONFIRMED",
        capabilities: ["Server-side rendering", "Edge runtime optimization"],
        proof: [{ name: "Boxsy", id: 8 }, { name: "WebMTP", id: 4 }],
        threatLevel: 5,
        category: "WEAPONS",
    },
    {
        id: "python",
        name: "Python",
        status: "CONFIRMED",
        capabilities: ["AI/ML pipeline automation", "Rapid prototyping"],
        proof: [{ name: "Boxsy", id: 8 }],
        threatLevel: 5,
        category: "WEAPONS",
    },
    {
        id: "express",
        name: "Express.js",
        status: "CONFIRMED",
        capabilities: ["Scalable REST APIs", "Middleware orchestration"],
        threatLevel: 5,
        category: "WEAPONS",
    },
    {
        id: "sveltekit",
        name: "SvelteKit",
        status: "CONFIRMED",
        capabilities: ["Reactive web applications", "Lightweight performance"],
        threatLevel: 5,
        category: "WEAPONS",
    },
    {
        id: "flutter",
        name: "Flutter",
        status: "CONFIRMED",
        capabilities: ["Cross-platform mobile apps", "Performant UI rendering"],
        proof: [{ name: "Totals", id: 1 }, { name: "Opus", id: 3 }],
        threatLevel: 5,
        category: "WEAPONS",
    },
    {
        id: "sql",
        name: "SQL",
        status: "CONFIRMED",
        capabilities: ["Complex query optimization", "Database normalization"],
        threatLevel: 5,
        category: "WEAPONS",
    },
    {
        id: "laravel",
        name: "Laravel",
        status: "CONFIRMED",
        capabilities: ["Robust PHP frameworks", "Eloquent ORM patterns"],
        threatLevel: 3,
        category: "WEAPONS",
    },
    {
        id: "swift",
        name: "Swift",
        status: "CONFIRMED",
        capabilities: ["Native macOS/iOS development", "SwiftUI frameworks"],
        proof: [{ name: "Ora browser", id: 5 }],
        threatLevel: 2,
        category: "WEAPONS",
    },
    // Tactical Assets
    {
        id: "docker",
        name: "Docker",
        status: "CONFIRMED",
        capabilities: ["Containerized deployment", "Environment parity"],
        threatLevel: 5,
        category: "TOOLS",
    },
    {
        id: "github",
        name: "GitHub",
        status: "CONFIRMED",
        capabilities: ["Version control", "Collaborative workflows"],
        threatLevel: 5,
        category: "TOOLS",
    },
    {
        id: "cicd",
        name: "CI/CD",
        status: "CONFIRMED",
        capabilities: ["Automated deployment pipelines", "Pipeline-as-code"],
        threatLevel: 5,
        category: "TOOLS",
    },
    {
        id: "figma",
        name: "Figma",
        status: "CONFIRMED",
        capabilities: ["UI/UX Prototyping", "Design system management"],
        threatLevel: 5,
        category: "TOOLS",
    },
    {
        id: "gcp",
        name: "GCP",
        status: "CONFIRMED",
        capabilities: ["Cloud infrastructure", "Serverless orchestration"],
        threatLevel: 5,
        category: "TOOLS",
    },
    {
        id: "aws",
        name: "AWS",
        status: "CONFIRMED",
        capabilities: ["Scalable backend services", "Data pipeline management"],
        threatLevel: 5,
        category: "TOOLS",
    },
    {
        id: "firebase",
        name: "Firebase",
        status: "CONFIRMED",
        capabilities: ["Real-time synchronization", "Authentication flows"],
        threatLevel: 5,
        category: "TOOLS",
    },
    {
        id: "supabase",
        name: "Supabase",
        status: "CONFIRMED",
        capabilities: ["Postgres-based backend architecture", "Real-time subscriptions"],
        threatLevel: 5,
        category: "TOOLS",
    },
    {
        id: "mongodb",
        name: "MongoDB",
        status: "CONFIRMED",
        capabilities: ["NoSQL document modeling", "High-availability clusters"],
        threatLevel: 5,
        category: "TOOLS",
    },
    {
        id: "stripe",
        name: "Stripe",
        status: "CONFIRMED",
        capabilities: ["Payment gateway integration", "Subscription billing models"],
        threatLevel: 5,
        category: "TOOLS",
    }
];

const TypewriterText = ({ text, delay = 0, onComplete, className }: { text: string, delay?: number, onComplete?: () => void, className?: string }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (index < text.length) {
                setDisplayedText((prev) => prev + text[index]);
                setIndex((prev) => prev + 1);
            } else if (onComplete) {
                onComplete();
            }
        }, 30);
        return () => clearTimeout(timeout);
    }, [index, text, onComplete]);

    return <span className={className}>{displayedText}</span>;
}

const WeaponCard = ({
    skill,
    activeId,
    setActiveId,
    onFocus
}: {
    skill: Skill,
    activeId: string | null,
    setActiveId: (id: string | null) => void,
    onFocus: (skill: Skill) => void
}) => {
    const isActive = activeId === skill.id;
    const [stamped, setStamped] = useState(false);

    useEffect(() => {
        if (isActive && !stamped) {
            const timer = setTimeout(() => setStamped(true), 600);
            return () => clearTimeout(timer);
        } else if (!isActive) {
            setStamped(false);
        }
    }, [isActive]);

    return (
        <motion.div
            onMouseEnter={() => setActiveId(skill.id)}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => {
                onFocus(skill);
            }}
            className={cn(
                "group relative bg-[#121212] border-l-2 border-red-900/40 p-5 font-mono text-sm overflow-hidden transition-all duration-300 cursor-pointer",
                isActive ? "bg-[#1a1a1a] shadow-[0_0_30px_rgba(153,27,27,0.2)] border-l-red-600 scale-[1.02] z-40" : "hover:bg-[#151515]"
            )}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col flex-1">
                    <span className="text-[10px] text-gray-600 tracking-tighter uppercase mb-1">
                        {skill.category === "WEAPONS" ? "ITEM_ID: " : "ASSET_ID: "}
                        {skill.id.toUpperCase()}
                    </span>
                    <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2 relative overflow-hidden h-7">
                        {skill.name}
                    </h3>
                </div>
                <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skull
                            key={i}
                            className={cn(
                                "w-3 h-3",
                                i < skill.threatLevel ? "text-red-600" : "text-gray-800"
                            )}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div className="border-t border-gray-800 pt-3">
                    <span className="text-[10px] text-red-900 font-bold block mb-2 tracking-widest uppercase">Capabilities:</span>
                    <ul className="space-y-1">
                        {skill.capabilities.map((cap, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-400 group-hover:text-gray-300">
                                <span className="text-red-900 mt-1">•</span>
                                {isActive ? (
                                    <TypewriterText text={cap} delay={i * 200} className="text-xs" />
                                ) : (
                                    <span className="text-xs">{cap}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <AnimatePresence>
                    {isActive && skill.proof && skill.proof.length > 0 && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-gray-800 pt-3"
                        >
                            <div className="mt-1">
                                <span className="text-[9px] text-gray-500 uppercase flex items-center gap-1">
                                    <Search className="w-3 h-3" /> Linked Evidence:
                                </span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {skill.proof.map((p) => (
                                        <Link
                                            key={p.id}
                                            href={`/evidence?id=${p.id}`}
                                            className="text-[10px] text-blue-400 underline cursor-pointer hover:text-blue-300 decoration-blue-400/30"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            [FILE_{p.id}_{p.name.toUpperCase().replace(/\s/g, "_")}]
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Stamp Animation */}
            <AnimatePresence>
                {stamped && (
                    <motion.div
                        initial={{ scale: 2, opacity: 0, rotate: -20, filter: "blur(10px)" }}
                        animate={{
                            scale: 1,
                            opacity: 0.6,
                            rotate: -15,
                            filter: "blur(0px)",
                            transition: { type: "spring", stiffness: 400, damping: 15 }
                        }}
                        className="absolute bottom-4 right-4 border-4 border-red-600 text-red-600 px-2 py-1 font-black text-xl pointer-events-none z-[100]"
                        style={{ boxShadow: "0 0 10px rgba(220, 38, 38, 0.4)" }}
                    >
                        CONFIRMED
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const IntelligenceMonitor = ({ activeSkill }: { activeSkill: Skill | null }) => {
    return (
        <div className="w-full bg-[#0d0d0d] border border-gray-800 p-6 relative overflow-hidden flex flex-col gap-6 shadow-2xl rounded-sm">
            {/* Radar Scan Section */}
            <div className="relative w-full aspect-square max-w-[200px] mx-auto opacity-80 mb-2">
                <div className="absolute inset-0 border-2 border-green-900/30 rounded-full" />
                <div className="absolute inset-4 border border-green-900/20 rounded-full" />
                <div className="absolute inset-8 border border-green-900/10 rounded-full" />

                {/* Radar Sweep */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className={cn(
                        "absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-green-500/20 origin-center rounded-full transition-opacity duration-300",
                        activeSkill ? "opacity-100" : "opacity-40"
                    )}
                    style={{ clipPath: "polygon(50% 50%, 100% 0, 100% 100%)" }}
                />

                {/* Dynamic Radar Pings */}
                <AnimatePresence>
                    {activeSkill ? (
                        <>
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="absolute top-1/4 left-1/3 w-2 h-2 bg-green-500 rounded-full animate-ping shadow-[0_0_10px_#22c55e]"
                            />
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0], x: [0, 10, -5], y: [0, -10, 5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]"
                            />
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <div className="text-[8px] font-mono text-green-500 bg-black/80 px-1 border border-green-500/50 animate-pulse uppercase">
                                    TGT_ACQUIRED
                                </div>
                            </motion.div>
                        </>
                    ) : (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-green-900/20 rounded-full" />
                    )}
                </AnimatePresence>

                {/* Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <div className="w-full h-[1px] bg-green-500" />
                    <div className="w-[1px] h-full bg-green-500 absolute" />
                </div>
            </div>

            {/* Live Terminal Log */}
            <div className="flex-1 font-mono text-[10px] space-y-4 bg-black/40 p-4 border border-gray-900 rounded-sm">
                <div className="flex items-center gap-2 text-green-500 border-b border-green-900/30 pb-2">
                    <Terminal className="w-4 h-4" />
                    <span className="tracking-widest uppercase">Live Intelligence Feed</span>
                </div>

                <div className="space-y-2 max-h-[250px] overflow-hidden scrollbar-none">
                    <AnimatePresence>
                        {activeSkill ? (
                            <motion.div
                                key={activeSkill.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-3"
                            >
                                <div className="text-gray-500 flex justify-between">
                                    <span>[TARGET_ID]</span>
                                    <span className="text-white">{activeSkill.id.toUpperCase()}</span>
                                </div>
                                <div className="text-gray-500 flex justify-between">
                                    <span>[THREAT_LEVEL]</span>
                                    <span className="text-red-500 font-bold">ALPHA-{activeSkill.threatLevel}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-800">
                                    <p className="text-green-500/70 mb-1">&gt; INITIALIZING_DEEP_SCAN...</p>
                                    <p className="text-green-500/70 mb-1">&gt; ANALYZING_CAPABILITIES...</p>
                                    <ul className="pl-4 space-y-1 text-white">
                                        {activeSkill.capabilities.map((c, i) => (
                                            <li key={i} className="flex gap-2">
                                                <span className="text-green-500">-</span>
                                                <TypewriterText text={c} delay={i * 300} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {activeSkill.proof && (
                                    <div className="pt-2 border-t border-gray-800">
                                        <p className="text-green-500/70 mb-2">&gt; LOCATING_FORENSIC_TRACES...</p>
                                        <div className="grid grid-cols-1 gap-1">
                                            {activeSkill.proof.map(p => (
                                                <Link
                                                    key={p.id}
                                                    href={`/evidence?id=${p.id}`}
                                                    className="text-blue-500 hover:text-blue-400 border border-blue-900/30 bg-blue-950/10 px-2 py-1 rounded-sm text-[9px] transition-colors"
                                                >
                                                    REF_FILE: {p.id}_{p.name.toUpperCase()}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="text-gray-700 animate-pulse">
                                <p>&gt; WAITING_FOR_INPUT...</p>
                                <p>&gt; STANDBY_FOR_TARGET_ACQUISITION</p>
                                <p>&gt; OMNI_SCANNER_ACTIVE...</p>
                                <div className="mt-8 flex justify-center">
                                    <Fingerprint className="w-12 h-12 opacity-10" />
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* System Status Indicators */}
            <div className="grid grid-cols-3 gap-2 opacity-50">
                <div className="bg-gray-900/50 p-2 flex flex-col items-center">
                    <Activity className="w-3 h-3 text-green-500 mb-1" />
                    <span className="text-[8px] font-mono">CPU: NOM</span>
                </div>
                <div className="bg-gray-900/50 p-2 flex flex-col items-center">
                    <Database className="w-3 h-3 text-blue-500 mb-1" />
                    <span className="text-[8px] font-mono">MEM: 82%</span>
                </div>
                <div className="bg-gray-900/50 p-2 flex flex-col items-center">
                    <Globe className="w-3 h-3 text-red-500 mb-1" />
                    <span className="text-[8px] font-mono">NET: ACTIVE</span>
                </div>
            </div>

            {/* CRT Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] z-20" />
        </div>
    );
};

export default function ModusOperandi() {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [focusedSkill, setFocusedSkill] = useState<Skill | null>(null);
    const [toasts, setToasts] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const addToast = (msg: string) => {
        setToasts(prev => [...prev, msg]);
        setTimeout(() => setToasts(prev => prev.slice(1)), 3000);
    };

    const handleFocus = (skill: Skill) => {
        setFocusedSkill(skill);
        addToast(`EVIDENCE_ADDED: ${skill.id.toUpperCase()}`);
    };

    // Filter evidence based on active skill for the "Line of Inquiry"
    const activeSkill = SKILLS.find(s => s.id === activeId) || null;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-300 selection:bg-red-900/50 selection:text-white pb-32">
            {/* Background Grain & Texture */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
                style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cork-board.png')" }} />

            <div className={cn(
                "container mx-auto p-6 md:p-12 relative z-10 transition-all duration-700",
                focusedSkill ? "scale-[0.98] blur-[2px] brightness-50" : "scale-100 blur-0"
            )}>
                {/* Header Section */}
                <div className="mb-20 flex flex-col md:flex-row justify-between items-end border-b border-gray-900 pb-8 gap-6">
                    <div>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-700 font-mono text-xs tracking-[0.5em] uppercase mb-2 block"
                        >
                            Classified Documentation // Project 2026-X
                        </motion.span>
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-display text-white tracking-widest uppercase mb-4 relative cursor-default break-words">
                            Modus Operandi
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-red-900 to-transparent"
                            />
                        </h1>
                        <p className="font-typewriter text-gray-500 max-w-xl text-lg italic">
                            "The patterns of execution. Every build is a calculated strike. Every line is a trace left behind."
                        </p>
                    </div>

                    <div className="flex flex-col items-end font-mono">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] text-gray-600 uppercase">Threat Status:</span>
                            <span className="text-red-500 font-bold bg-red-900/10 px-2 tracking-widest uppercase">Critical</span>
                        </div>
                        <div className="text-[10px] text-gray-600 uppercase">Clearance: Level 5 Omni</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" ref={containerRef}>
                    {/* Skills Inquiry Columns */}
                    <div className="lg:col-span-8 space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Weapons Section */}
                            <div className="space-y-6">
                                <div className="bg-[#1a1111] border border-red-900/30 p-2 inline-block mb-4 transform -rotate-2 shadow-lg">
                                    <span className="text-red-500 font-display text-xl px-4 flex items-center gap-2">
                                        <Crosshair className="w-5 h-5" /> PRIMARY WEAPONS
                                    </span>
                                </div>
                                <div className="grid gap-4">
                                    {SKILLS.filter(s => s.category === "WEAPONS").map(skill => (
                                        <WeaponCard
                                            key={skill.id}
                                            skill={skill}
                                            activeId={activeId}
                                            setActiveId={setActiveId}
                                            onFocus={handleFocus}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Tools & Tactics Column */}
                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <div className="bg-[#11181a] border border-blue-900/30 p-2 inline-block mb-4 transform rotate-1 shadow-lg">
                                        <span className="text-blue-500 font-display text-xl px-4 uppercase">Tactical Assets</span>
                                    </div>
                                    <div className="grid gap-4">
                                        {SKILLS.filter(s => s.category !== "WEAPONS").map(skill => (
                                            <WeaponCard
                                                key={skill.id}
                                                skill={skill}
                                                activeId={activeId}
                                                setActiveId={setActiveId}
                                                onFocus={handleFocus}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Investigation Details / Evidence Sidebar - NEW CREATIVE SPACE */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
                        <IntelligenceMonitor activeSkill={activeSkill} />

                        {/* Static Identity Verification */}
                        <div className="border border-gray-800 p-4 font-mono text-[9px] bg-black/20 flex gap-4 items-center">
                            <div className="w-12 h-12 bg-red-950/30 border border-red-900/50 relative overflow-hidden">
                                <Fingerprint className="w-full h-full text-red-900/50" />
                                <motion.div
                                    animate={{ top: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 w-full h-0.5 bg-red-500"
                                />
                            </div>
                            <div className="flex-1 opacity-50">
                                <p>IDENT_VERIFIED: TRUE</p>
                                <p>ENCRYPTION: AES_256</p>
                                <p>LOCATION: UNDISCLOSED</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Case File Overlay Selection */}
            <AnimatePresence>
                {focusedSkill && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
                        onClick={() => setFocusedSkill(null)}
                    >
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                        <motion.div
                            initial={{ scale: 0.8, y: 50, rotate: -5 }}
                            animate={{ scale: 1, y: 0, rotate: 0 }}
                            exit={{ scale: 0.8, y: 50, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white text-black w-full max-w-2xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col md:flex-row border-4 border-white"
                        >
                            {/* Case File Folder Left Side */}
                            <div className="w-full md:w-1/3 bg-[#d4c3a3] p-6 border-r border-[#bba780] flex flex-col justify-between relative shadow-inner">
                                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }} />
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-red-900 rounded-full mb-4 flex items-center justify-center shadow-lg transform -rotate-12 border-2 border-red-950">
                                        <Skull className="text-white w-6 h-6" />
                                    </div>
                                    <h2 className="font-display text-2xl leading-none uppercase tracking-tighter">
                                        Subject:<br />{focusedSkill.name}
                                    </h2>
                                    <p className="mt-4 font-mono text-[9px] text-gray-700 uppercase leading-relaxed font-bold">
                                        File ID: {focusedSkill.id.toUpperCase()}<br />
                                        Clearance: Level 5<br />
                                        Priority: OMEGA-7
                                    </p>
                                </div>
                                <div className="border-t-2 border-dashed border-gray-600/30 pt-4 relative z-10">
                                    <div className="text-[10px] font-bold text-red-900 opacity-60 flex items-center gap-1">
                                        <Zap className="w-3 h-3" /> FINGERPRINT_MATCHED
                                    </div>
                                    <div className="w-16 h-20 bg-black/5 mt-2 rounded-sm border border-black/10 flex flex-wrap gap-0.5 p-1 overflow-hidden opacity-40">
                                        {Array.from({ length: 40 }).map((_, i) => (
                                            <div key={i} className="w-1 h-3 bg-black/40" />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Case File Paper Right Side */}
                            <div className="w-full md:w-2/3 bg-[#f8f5e9] p-8 font-typewriter overflow-y-auto max-h-[80vh] relative">
                                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }} />
                                <div className="absolute top-4 right-4 bg-red-700 text-white text-[8px] px-2 py-0.5 font-bold uppercase tracking-widest rotate-12 shadow-sm">Classified</div>

                                <section className="mb-8 relative z-10">
                                    <h4 className="text-xs font-bold bg-black text-white inline-block px-1 mb-2">FIELD_INTEL</h4>
                                    <p className="text-sm leading-relaxed text-gray-800">
                                        Investigation of asset <span className="font-bold underline uppercase">{focusedSkill.name}</span> reveals extensive {focusedSkill.capabilities[0].toLowerCase()} capabilities.
                                        Subject has been deployed in multiple high-stakes environments documented in Case #404-B.
                                    </p>
                                </section>

                                {focusedSkill.proof && (
                                    <section className="relative z-10">
                                        <h4 className="text-xs font-bold bg-black text-white inline-block px-1 mb-2">FORENSIC_LINKS</h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            {focusedSkill.proof.map((p) => (
                                                <Link
                                                    key={p.id}
                                                    href={`/evidence?id=${p.id}`}
                                                    className="text-[10px] bg-black/5 p-2 border border-black/10 flex justify-between items-center group/p hover:bg-black/10 transition-colors"
                                                >
                                                    <span>FILE_{p.id}_{p.name.toUpperCase()}</span>
                                                    <Search className="w-3 h-3 text-red-900 opacity-50 group-hover/p:opacity-100" />
                                                </Link>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                <div className="mt-12 pt-4 border-t border-black/10 relative z-10">
                                    <p className="text-[10px] text-gray-500 italic">Signature: __________________________</p>
                                    <p className="text-[8px] text-gray-400 mt-1 uppercase tracking-widest">End of forensic documentation</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toasts */}
            <div className="fixed bottom-20 sm:bottom-8 left-4 right-4 sm:left-8 sm:right-auto z-[2000] space-y-2 max-w-[calc(100vw-2rem)]">
                <AnimatePresence>
                    {toasts.map((toast, j) => (
                        <motion.div
                            key={toast + j}
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                            className="bg-red-900 text-white px-4 py-2 font-mono text-[10px] border-l-4 border-white flex items-center gap-2 shadow-2xl uppercase"
                        >
                            <AlertTriangle className="w-3 h-3" />
                            {toast}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Evidence Strings (Global Overlays) */}
            <div className="fixed inset-0 pointer-events-none z-[5]">
                <AnimatePresence>
                    {activeId && (activeId === "ts" || activeId === "nextjs" || activeId === "python") && (
                        <RedString
                            x1Percent={40}
                            y1Percent={50}
                            x2Percent={80}
                            y2Percent={75}
                            tension={0.8}
                        />
                    )}
                    {activeId && (activeId === "swift") && (
                        <RedString
                            x1Percent={40}
                            y1Percent={50}
                            x2Percent={80}
                            y2Percent={85}
                            tension={0.8}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
