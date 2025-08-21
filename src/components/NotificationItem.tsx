import React, { useRef } from 'react'
import { ExternalLink } from 'lucide-react'

type Item = {
	id: string
	title?: string
	message?: string
	domain?: string
	site?: string
	source?: string
	tags?: string[]
	severity?: 'info' | 'warning' | 'critical'
	unread?: boolean
	timeago?: string
	sourceUrl?: string
	workflowName?: string
}

type Props = {
	item?: Item
	onOpen?: (id: string) => void
	// Backward compatibility with previous prop shape
	n?: { id: string; title: string; sourceUrl: string; workflowName: string; severity: 'info'|'warning'|'critical'; unread: boolean }
	selectedId?: string
	onExternal?: (id: string, url?: string) => void
}

function severityChip(sev?: string) {
	const s = (sev || '').toLowerCase()
	if (s === 'critical') return <span className="ui-chip ui-chip--crit">critical</span>
	if (s === 'warning') return <span className="ui-chip ui-chip--warn">warning</span>
	if (s === 'info') return <span className="ui-chip ui-chip--info">info</span>
	return null
}

export default function NotificationItem({ item, onOpen, n, selectedId, onExternal }: Props) {
	const data: Item = item || (n ? { id: n.id, title: n.title, sourceUrl: n.sourceUrl, workflowName: n.workflowName, severity: n.severity, unread: n.unread } : ({} as any))
	const title = data.title ?? data.message ?? 'New event detected'
	const domain = data.domain ?? data.site ?? data.source ?? (data.sourceUrl ? new URL(data.sourceUrl).hostname : '')
	const timeago = data.timeago ?? ''
	const tags = data.tags ?? (data.workflowName ? [data.workflowName] : [])
	const isSelected = selectedId ? data.id === selectedId : false

	const rowRef = useRef<HTMLElement>(null)

	const openDetails = () => onOpen?.(data.id)
	const onKeyActivate: React.KeyboardEventHandler<HTMLElement> = (e) => {
		// Only trigger for the article itself, not child controls
		if (e.currentTarget !== e.target) return
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			openDetails()
		}
	}

	// Best-effort URL detection from the item
	const href = (data as any).url ?? (data as any).link ?? data.sourceUrl ?? (data as any).permalink ?? (data as any).page ?? null

	// Ensure :focus-within is cleared (iOS can keep focus after opening _blank)
	const clearRowFocus = (clicked?: HTMLElement) => {
		clicked?.blur?.()
		const active = document.activeElement as HTMLElement | null
		if (active && rowRef.current && rowRef.current.contains(active)) {
			active.blur()
		}
		requestAnimationFrame(() => {
			const again = document.activeElement as HTMLElement | null
			if (again && rowRef.current && rowRef.current.contains(again)) {
				again.blur()
			}
		})
		setTimeout(() => {
			const later = document.activeElement as HTMLElement | null
			if (later && rowRef.current && rowRef.current.contains(later)) {
				later.blur()
			}
		}, 50)
	}

	return (
		<article ref={rowRef} className="notif-card group cursor-pointer" data-selected={isSelected ? 'true' : undefined} role="button" tabIndex={0} onClick={openDetails}>
			<div className="relative z-10">
				<div className="notif-head">
					<span className="unread-dot mt-2" style={{ opacity: data.unread ? 1 : 0.25 }} />
					<h3 className="notif-title clamp-2">{title}</h3>
					{href ? (
						<a
							href={href as string}
							target="_blank"
							rel="noopener noreferrer"
							className="open-cta"
							aria-label="Open source"
							onClick={(e) => { e.stopPropagation(); clearRowFocus(e.currentTarget) }}
							onMouseDown={(e) => e.stopPropagation()}
							onPointerUp={(e) => clearRowFocus(e.currentTarget as HTMLAnchorElement)}
						>
							<ExternalLink size={16} />
						</a>
					) : (
						<button
							type="button"
							className="open-cta"
							aria-label="Open source"
							onClick={(e) => { e.stopPropagation(); onExternal?.(data.id, undefined); clearRowFocus(e.currentTarget) }}
							onMouseDown={(e) => e.stopPropagation()}
							onPointerUp={(e) => clearRowFocus(e.currentTarget as HTMLButtonElement)}
						>
							<ExternalLink size={16} />
						</button>
					)}
				</div>

				{/* Bottom row: labels left, domain right */}
				<div className="mt-3 flex items-center justify-between gap-3">
					<div className="flex items-center gap-2 flex-wrap">
						{severityChip(data.severity)}
						{tags.map((t, i) => (
							<span key={`${t}-${i}`} className="ui-chip">{t}</span>
						))}
					</div>
					<div className="text-xs text-[rgb(var(--text-muted))] dark:text-white/60 truncate ml-auto">
						{domain}
					</div>
				</div>
			</div>
		</article>
	)
} 