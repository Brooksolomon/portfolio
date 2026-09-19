"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const items = [
    { name: "CRIME SCENE", href: "/" },
    { name: "SUSPECT", href: "/suspect" },
    { name: "EVIDENCE", href: "/evidence" },
    { name: "MODUS OPERANDI", href: "/modus-operandi" },
    { name: "TIMELINE", href: "/timeline" },
];

export function Navigation() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-[100] flex justify-center pt-2 pointer-events-none">
                <div className="flex -space-x-1 pointer-events-auto">
                    {/* Desktop: show all tabs */}
                    <div className="hidden md:flex -space-x-1">
                        {items.map((item, idx) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <motion.div
                                        className={cn(
                                            "relative px-4 md:px-6 py-3 font-display text-xs md:text-sm tracking-widest transition-all duration-300",
                                            "border-t-2 border-x border-black/20",
                                            "rounded-t-xl group cursor-pointer",
                                            isActive
                                                ? "bg-[#d4c598] text-red-900 shadow-[0_-8px_20px_rgba(0,0,0,0.3)] z-10 -translate-y-1"
                                                : "bg-[#2a2a2a] text-gray-500 hover:text-gray-300 z-0"
                                        )}
                                        style={{
                                            clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
                                            zIndex: isActive ? 50 : 10 - idx
                                        }}
                                    >
                                        <span className="relative">
                                            {item.name}
                                            <div className={cn(
                                                "absolute -bottom-1 left-0 w-0 h-0.5 bg-red-800 transition-all duration-300 group-hover:w-full",
                                                isActive && "w-full opacity-50"
                                            )} />
                                        </span>
                                        <div className={cn(
                                            "absolute top-0 left-0 w-full h-1 opacity-20",
                                            isActive ? "bg-white" : "bg-black"
                                        )} />
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile: single "menu" tab that opens drawer */}
                    <div className="md:hidden flex items-center">
                        <motion.button
                            type="button"
                            aria-label="Toggle menu"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className={cn(
                                "relative px-5 py-3 font-display text-xs tracking-widest transition-all duration-300",
                                "border-t-2 border-x border-black/20 rounded-t-xl",
                                "bg-[#2a2a2a] text-gray-300 flex items-center gap-2"
                            )}
                            style={{ clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)" }}
                        >
                            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                            MENU
                        </motion.button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[99] md:hidden"
                            onClick={() => setMobileOpen(false)}
                            aria-hidden="true"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed top-14 left-4 right-4 z-[101] md:hidden rounded-b-xl overflow-hidden border-x border-b border-black/20 shadow-2xl"
                        >
                            <div className="bg-[#1a1a1a] p-4 space-y-1">
                                {items.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={cn(
                                                "block px-4 py-3 font-display text-sm tracking-widest rounded-lg transition-colors",
                                                isActive ? "bg-[#d4c598] text-red-900" : "text-gray-400 hover:bg-white/5 hover:text-white"
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
