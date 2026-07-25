'use client'

import { useEffect, useRef } from 'react'

export default function ViewCounter({ slug, onView }: { slug: string; onView: (slug: string) => Promise<void> }) {
    const fired = useRef(false)

    useEffect(() => {
        if (fired.current) return
        fired.current = true
        onView(slug).catch(console.error)
    }, [slug, onView])

    return null
}
