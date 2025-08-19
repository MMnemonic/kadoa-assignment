import { useEffect, useRef } from 'react'
import { X, ExternalLink } from 'lucide-react'
import type { Notification } from '../api/contracts'
import Portal from '../components/Portal'

type Props = {
	open: boolean
	onClose: () => void
	onPrev?: () => void
	onNext?: () => void
	data?: Notification | null
}

export default function DetailsDrawer({ open, onClose, onPrev, onNext, data }: Props) {
	const panelRef = useRef<HTMLDivElement>(null)
	const returnFocusRef = useRef<HTMLElement | null>(null)

	// body scroll lock + focus return
	useEffect(() => {
		if (open) {
			returnFocusRef.current = (document.activeElement as HTMLElement) ?? null
			document.body.style.overflow = 'hidden'
			panelRef.current?.focus()
		} else {
			document.body.style.overflow = ''
			returnFocusRef.current?.focus()
		}
	}, [open])

	useEffect(() => {
		if (!open) return
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
			if (e.key.toLowerCase() === 'j') onNext?.()
			if (e.key.toLowerCase() === 'k') onPrev?.()
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [open, onClose, onNext, onPrev])

	if (!open) return null

	return (
		<Portal>
			{/* Full-screen container so nothing clips */}
			<div className="fixed inset-0 z-[100] pointer-events-none">
				{/* Overlay */}
				<div
					className="absolute inset-0 bg-black/40 pointer-events-auto"
					onClick={onClose}
					aria-hidden
				/>
				{/* Right-side panel */}
				<aside
					ref={panelRef}
					role="dialog"
					aria-modal="true"
					aria-labelledby="drawer-title"
					tabIndex={-1}
					className={`absolute right-0 inset-y-0 w-[min(720px,100vw)] bg-[rgb(var(--bg-surface))] border-l border-[rgb(var(--border))] shadow-elev-2 pointer-events-auto outline-none transition-transform duration-300 will-change-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}
				>
					<div className="grid h-full grid-rows-[auto,1fr,auto]">
						{/* Header: title + controls + tabs */}
						<div className="row-start-1 sticky top-0 z-10 bg-[rgb(var(--bg-surface))] border-b border-[rgb(var(--border))] px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-4">
							<div className="flex items-center justify-between gap-2 py-1">
								<div className="min-w-0">
									<h2 id="drawer-title" className="truncate text-lg font-semibold">
										{data?.title ?? 'Notification'}
									</h2>
									<div className="mt-1 text-xs text-white/60 truncate">
										{(data as any)?.sourceHost ?? ''} • {(data as any)?.workflowName ?? ''} • {(data as any)?.severity ?? ''}
									</div>
								</div>
								<div className="flex items-center gap-2">
									{onPrev && <button className="ui-btn ui-btn--ghost" onClick={onPrev}>K ↑</button>}
									{onNext && <button className="ui-btn ui-btn--ghost" onClick={onNext}>J ↓</button>}
									<button className="ui-btn ui-btn--ghost" onClick={onClose} aria-label="Close">
										<X className="h-4 w-4" />
									</button>
								</div>
							</div>
							<div className="mt-2 flex items-center gap-2">
								<button className="ui-segitem data-[active=true]:bg-white/5" data-active={true}>Summary</button>
								<button className="ui-segitem">Diff</button>
								<button className="ui-segitem">Raw</button>
							</div>
						</div>

						{/* Scrollable content */}
						<div className="row-start-2 min-h-0 overflow-auto px-4 py-4 space-y-4">
							<section className="space-y-2">
								<div className="text-sm text-white/80">{(data as any)?.summary ?? 'No summary available.'}</div>
								<div className="flex flex-wrap gap-2">
									{((data as any)?.tags ?? []).map((t: string) => (
										<span key={t} className="ui-chip">{t}</span>
									))}
								</div>
							</section>

							<section className="ui-card bg-white/5">
								<div className="text-xs uppercase tracking-wide text-white/60 mb-2">Change preview</div>
								<pre className="text-sm overflow-auto">{(data as any)?.diff ?? 'No diff available.'}</pre>
							</section>

							<section className="ui-card bg-white/5">
								<div className="text-xs uppercase tracking-wide text-white/60 mb-2">Raw payload</div>
								<pre className="text-xs overflow-auto">{JSON.stringify(((data as any)?.raw ?? {}), null, 2)}</pre>
							</section>
						</div>

						{/* Footer */}
						<div className="row-start-3 px-4 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] border-t border-[rgb(var(--border))] flex items-center justify-between gap-3">
							<div className="flex gap-2">
								<button className="ui-btn">Mark unread</button>
								<button className="ui-btn">Pin</button>
							</div>
							<div className="flex gap-2">
								<a className="ui-btn" href={(data as any)?.sourceUrl} target="_blank" rel="noopener noreferrer">
									Open <ExternalLink className="h-4 w-4" />
								</a>
								{(data as any)?.workflowUrl && (
									<a className="ui-btn" href={(data as any)?.workflowUrl} target="_blank" rel="noopener noreferrer">Workflow</a>
								)}
								<button className="ui-btn ui-btn--primary" onClick={onClose}>Close</button>
							</div>
						</div>
					</div>
				</aside>
			</div>
		</Portal>
	)
} 