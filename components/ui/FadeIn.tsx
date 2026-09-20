'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'

export function FadeIn({ children, ...props }: HTMLMotionProps<'div'>) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            {...props}
        >
            {children}
        </motion.div>
    )
}
