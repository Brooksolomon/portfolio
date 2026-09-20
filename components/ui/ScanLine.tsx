'use client'

import { motion } from 'framer-motion'

export function ScanLine() {
    return (
        <motion.div
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-accent-red/30 z-20 pointer-events-none blur-[1px]"
        />
    )
}
