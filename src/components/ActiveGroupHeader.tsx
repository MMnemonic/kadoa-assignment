import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
	labels: string[]
	offsetPx: number
	scopeSelector?: string
}

export default function ActiveGroupHeader({ labels, offsetPx, scopeSelector }: Props) {
	const [active, setActive] = useState(labels[0] ?? '')
	const [near, setNear] = useState(false)
	const raf = useRef<number | null>(null)

	const scopeEl = useMemo<HTMLElement | Document>(() => {
		if (!scopeSelector) return document
		const el = document.querySelector<HTMLElement>(scopeSelector)
		return el || document
	}, [scopeSelector])

	const nodes = useMemo(() => {
		return labels
			.map((label) => {
				const el = (scopeEl instanceof Document ? scopeEl : document).querySelector(
					`[data-group="${CSS.escape(label)}"]`,
				) as HTMLElement | null
				return { label, el }
			})
			.filter((x) => x.el)
	}, [labels, scopeEl])

	useEffect(() => {
		function compute() {
			const cutoff = offsetPx + 1
			let current = labels[0] ?? ''
			let currentTop = Infinity
			for (const { label, el } of nodes) {
				const top = el!.getBoundingClientRect().top
				if (top <= cutoff) {
					current = label
					currentTop = top
				}
			}
			setActive(current)
			const diff = Math.abs(currentTop - offsetPx)
			setNear(diff <= 6)
		}
		compute()

		const onScroll = () => {
			if (raf.current != null) return
			raf.current = requestAnimationFrame(() => {
				raf.current = null
				compute()
			})
		}

		window.addEventListener('scroll', onScroll, { passive: true })
		window.addEventListener('resize', onScroll, { passive: true })
		const ro = new ResizeObserver(onScroll)
		nodes.forEach((n) => n.el && ro.observe(n.el!))
		return () => {
			window.removeEventListener('scroll', onScroll)
			window.removeEventListener('resize', onScroll)
			ro.disconnect()
			if (raf.current) cancelAnimationFrame(raf.current)
		}
	}, [nodes, labels, offsetPx])

	if (!active) return null

	return (
		<div className="floating-header" style={{ top: offsetPx }} data-near={near ? 'true' : 'false'} aria-hidden>
			<div className="floating-header__inner">{active}</div>
		</div>
	)
} 