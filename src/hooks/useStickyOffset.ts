import { useEffect } from 'react'

export function useStickyOffset({ containerRef, filtersRef, topbarSelector }: { containerRef: React.RefObject<HTMLElement>, filtersRef: React.RefObject<HTMLElement>, topbarSelector: string }) {
	useEffect(() => {
		const root = containerRef.current
		if (!root) return
		const topbar = document.querySelector<HTMLElement>(topbarSelector)
		const compute = () => {
			const top = (topbar?.offsetHeight || 0) + (filtersRef.current?.offsetHeight || 0) + 8
			root.style.setProperty('--sticky-offset', `${top}px`)
		}
		compute()
		const ro = new ResizeObserver(compute)
		topbar && ro.observe(topbar)
		filtersRef.current && ro.observe(filtersRef.current)
		return () => ro.disconnect()
	}, [containerRef, filtersRef, topbarSelector])
} 