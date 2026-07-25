"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PolaroidProps {
    src: string;
    alt: string;
    caption?: string;
    className?: string;
    rotation?: number;
    width?: number;
    height?: number;
    onClick?: () => void;
}

export function Polaroid({
    src,
    alt,
    caption,
    className,
    rotation = 0,
    onClick,
}: PolaroidProps) {
    return (
        <motion.div
            initial={{ scale: 1, rotate: rotation }}
            animate={{ scale: 1, rotate: rotation }}
            whileHover={{
                scale: 1.08,
                rotate: rotation + (rotation > 0 ? 3 : -3),
                transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className={cn(
                "bg-white p-2 pb-6 shadow-[0_10px_30px_rgba(0,0,0,0.4)] cursor-pointer transition-shadow hover:shadow-[0_40px_80px_rgba(0,0,0,0.7)] inline-block relative border border-white/20",
                "w-[240px] sm:w-[280px]",
                className
            )}
            onClick={onClick}
        >
            {/* Push Pin */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-800 shadow-[2px_2px_5px_rgba(0,0,0,0.4)] z-10 border border-red-900">
                <div className="absolute top-1 left-1 w-1 h-1 bg-red-400 rounded-full opacity-50" />
            </div>

            <div className="relative bg-gray-100 grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden aspect-square flex items-center justify-center">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 640px) 240px, 280px"
                    className="object-contain"
                />
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
                    style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }} />
            </div>
            {caption && (
                <p className="mt-3 text-center font-hand text-black text-base transform -rotate-1 px-2 leading-tight">
                    {caption}
                </p>
            )}
        </motion.div>
    );
}
