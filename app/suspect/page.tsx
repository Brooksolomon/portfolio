"use client";

import { motion } from "framer-motion";
import { Polaroid } from "@/components/ui/Polaroid";
import { Github, Linkedin, Send, Twitter } from "lucide-react";

export default function SuspectPage() {
    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white text-black p-4 sm:p-6 md:p-8 shadow-2xl relative rotate-1 overflow-hidden"
                style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')" }} // Optional paper texture
            >
                {/* Header */}
                <div className="border-b-4 border-black pb-4 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tighter">Suspect Profile</h1>
                        <p className="font-typewriter text-xs sm:text-sm mt-2">DEPARTMENT OF INVESTIGATION // CASE #404</p>
                    </div>
                    <div className="text-left sm:text-right font-typewriter text-sm">
                        <p>DATE: {new Date().toLocaleDateString()}</p>
                        <p>STATUS: <span className="text-red-600 font-bold">AT LARGE</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    {/* Mugshot Section */}
                    <div className="col-span-1 flex flex-col items-center md:items-start overflow-visible mt-4 md:mt-0">
                        <Polaroid
                            src="/images/brook.png"
                            alt="Suspect Mugshot"
                            caption="BROOK SOLOMON"
                            rotation={-2}
                            width={220}
                            height={280}
                            className="max-w-full"
                        />
                        <div className="mt-4 font-typewriter text-sm bg-paper-yellow/30 p-2 border border-dashed border-gray-400 w-full text-center">
                            <span className="font-bold block text-xs uppercase text-gray-500">Last Seen At</span>
                            <span className="text-red-800">Addis Ababa, Ethiopia</span>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="col-span-2 space-y-6 font-typewriter">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-dashed border-gray-400 pb-4">
                            <div>
                                <span className="font-bold block text-gray-500 text-xs uppercase">Name</span>
                                <span className="text-xl">Brook Solomon A.K.A Solo codes</span>
                            </div>
                            <div>
                                <span className="font-bold block text-gray-500 text-xs uppercase">Alias</span>
                                <span className="text-xl">Full-Stack Dev</span>
                            </div>
                            <div>
                                <span className="font-bold block text-gray-500 text-xs uppercase">Last Seen</span>
                                <span className="text-lg">Shipping Code @ 3AM</span>
                            </div>
                            <div>
                                <span className="font-bold block text-gray-500 text-xs uppercase">Motive</span>
                                <span className="text-lg">Obsession with Building</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-display text-2xl border-b border-black inline-block">Psychological Analysis</h3>
                            <p className="leading-relaxed">
                                Subject displays high aptitude for complex problem solving. Tendency to over-engineer
                                solutions if not monitored. Known to operate across the full stack, showing disregard for
                                frontend/backend boundaries.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-display text-2xl border-b border-black inline-block">Background</h3>
                            <p className="leading-relaxed">
                                History of involvement in competitive programming (ICPC).
                                Recent activity suggests deep involvement with Typescript.
                            </p>
                        </div>

                        {/* Digital Footprint / Socials */}
                        <div className="space-y-4 pt-4">
                            <h3 className="font-display text-xl sm:text-2xl border-b border-black inline-block uppercase tracking-widest text-red-900">Digital Footprint</h3>
                            <div className="flex flex-wrap gap-2">
                                <a href="https://github.com/brooksolomon" target="_blank" rel="noopener noreferrer" className="bg-[#1a1a1a] text-white px-2 py-1.5 flex items-center gap-1.5 hover:bg-red-900 transition-colors border border-black shadow-[2px_2px_0px_#000]">
                                    <Github className="w-3.5 h-3.5" />
                                    <span className="font-mono text-[10px]">GITHUB.EXE</span>
                                </a>
                                <a href="https://linkedin.com/in/brooksolomon" target="_blank" rel="noopener noreferrer" className="bg-[#1a1a1a] text-white px-2 py-1.5 flex items-center gap-1.5 hover:bg-red-900 transition-colors border border-black shadow-[2px_2px_0px_#000]">
                                    <Linkedin className="w-3.5 h-3.5" />
                                    <span className="font-mono text-[10px]">LINKEDIN.COM</span>
                                </a>
                                <a href="https://t.me/solodevchronicles" target="_blank" rel="noopener noreferrer" className="bg-[#1a1a1a] text-white px-2 py-1.5 flex items-center gap-1.5 hover:bg-red-900 transition-colors border border-black shadow-[2px_2px_0px_#000]">
                                    <Send className="w-3.5 h-3.5" />
                                    <span className="font-mono text-[10px]">TELEGRAM.MSG</span>
                                </a>
                                <a href="https://x.com/thebrooksolo" target="_blank" rel="noopener noreferrer" className="bg-[#1a1a1a] text-white px-2 py-1.5 flex items-center gap-1.5 hover:bg-red-900 transition-colors border border-black shadow-[2px_2px_0px_#000]">
                                    <Twitter className="w-3.5 h-3.5" />
                                    <span className="font-mono text-[10px]">X_COM.LOG</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Stamps - no overflow so desktop doesn't get a scrollbar */}
                <div className="mt-6 sm:mt-8 flex justify-end space-x-4">
                    <div className="border-2 sm:border-4 border-red-700 text-red-700 font-black text-2xl sm:text-4xl p-2 opacity-50 -rotate-12 select-none shrink-0">
                        CONFIDENTIAL
                    </div>
                </div>

            </motion.div>
        </div>
    );
}
