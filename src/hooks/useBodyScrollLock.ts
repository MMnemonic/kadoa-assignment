import { useEffect, useRef } from 'react'

/**
 * Locks body scroll while preserving current scroll position.
 * Adds/removes inline styles only while `locked` is true.
 * Also compensates for the scrollbar to avoid layout shift on desktop.
 */
export function useBodyScrollLock(locked: boolean) {
	const scrollYRef = useRef(0)

	useEffect(() => {
		if (!locked) return

		// Preserve current scroll
		scrollYRef.current = window.scrollY || window.pageYOffset || 0

		// Compensate for scrollbar so layout doesn't shift
		const scrollbarW = window.innerWidth - document.documentElement.clientWidth
		const body = document.body as HTMLBodyElement
		const prevOverflow = body.style.overflow
		const prevPosition = body.style.position
		const prevTop = body.style.top
		const prevWidth = body.style.width
		const prevPaddingRight = body.style.paddingRight

		body.style.overflow = 'hidden' // prevent scroll
		body.style.position = 'fixed' // lock
		body.style.top = `-${scrollYRef.current}px`
		body.style.width = '100%'
		if (scrollbarW > 0) {
			// avoid content shift when the scrollbar disappears
			body.style.paddingRight = `${scrollbarW}px`
		}

		return () => {
			// Restore styles
			body.style.overflow = prevOverflow
			body.style.position = prevPosition
			body.style.top = prevTop
			body.style.width = prevWidth
			body.style.paddingRight = prevPaddingRight

			// Restore scroll
			window.scrollTo(0, scrollYRef.current)
		}
	}, [locked])
} 