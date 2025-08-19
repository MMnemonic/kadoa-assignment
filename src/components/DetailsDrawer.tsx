import { useEffect, useRef } from 'react'
import { X, ExternalLink } from 'lucide-react'
import type { Notification } from '../api/contracts'

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

	return (
		<>
			{/* Overlay */}
			<div
				aria-hidden={!open}
				className={`fixed inset-0 z-40 transition-opacity ${open ? 'bg-black/40 opacity-100' : 'pointer-events-none opacity-0'}`}
				onClick={onClose}
			/>
			{/* Panel */}
			<aside
				ref={panelRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="drawer-title"
				tabIndex={-1}
				className={`fixed right-0 top-0 z-50 h-dvh w-[92vw] max-w-[720px] outline-none transition-transform duration-300 will-change-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}
			>
				<div className="ui-card ui-glass-strong h-full flex flex-col rounded-l-2xl shadow-elev-2">
					{/* Header */}
					<div className="flex items-center justify-between p-4 border-b border-white/10">
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

					{/* Tabs */}
					<div className="flex items-center gap-2 p-3 border-b border-white/10">
						<button className="ui-segitem data-[active=true]:bg-white/5" data-active={true}>Summary</button>
						<button className="ui-segitem">Diff</button>
						<button className="ui-segitem">Raw</button>
					</div>

					{/* Content */}
					<div className="flex-1 overflow-auto p-4 space-y-4">
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

					{/* Footer actions */}
					<div className="p-4 border-t border-white/10 flex items-center justify-between">
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
		</>
	)
} 