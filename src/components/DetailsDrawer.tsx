import { useEffect, useRef } from 'react'
import { X, ExternalLink } from 'lucide-react'
import type { Notification } from '../api/contracts'
import Portal from '../components/Portal'
import SafeValue, { renderSafeValue } from './SafeValue'

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

	const bodyKey = (data as any)?.id ?? 'closed'

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
					<div key={bodyKey} className="grid h-full grid-rows-[auto,1fr,auto]">
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
							{/* Summary */}
							<section className="space-y-2">
								<SafeValue value={(data as any)?.summary ?? 'No summary available.'} />
								<div className="flex flex-wrap gap-2">
									{((data as any)?.tags ?? []).map((t: string) => (
										<span key={t} className="ui-chip">{t}</span>
									))}
								</div>
							</section>

							{/* Diff */}
							<section className="space-y-2">
								<div className="text-xs uppercase tracking-wide text-white/60">Change preview</div>
								{(() => {
									const raw: any = (data as any)?.diff ?? (data as any)?.changes
									if (!raw) return <div className="text-white/50">No diff available.</div>
									const rows: Array<{ field: string; before: unknown; after: unknown }> = Array.isArray(raw)
										? raw
										: Object.entries(raw as Record<string, any>).map(([field, val]) => {
											if (val && typeof val === 'object' && 'before' in val && 'after' in val) {
												return { field, before: (val as any).before, after: (val as any).after }
											}
											return { field, before: undefined, after: val }
										})
									if (!rows.length) return <div className="text-white/50">No diff available.</div>
									return (
										<div className="divide-y divide-white/10 rounded-xl overflow-hidden border border-white/10">
											<div className="grid grid-cols-3 gap-3 px-3 py-2 text-xs uppercase tracking-wide text-white/50 bg-white/[.04]">
												<div>Field</div>
												<div>Before</div>
												<div>After</div>
											</div>
											{rows.map((r, i) => (
												<div key={r.field || i} className="grid grid-cols-3 gap-3 px-3 py-2">
													<div className="font-medium">{String(r.field ?? '(unknown)')}</div>
													<div>{renderSafeValue(r.before)}</div>
													<div>{renderSafeValue(r.after)}</div>
												</div>
											))}
										</div>
									)
								})()}
							</section>

							{/* Raw */}
							<section className="space-y-2">
								<div className="text-xs uppercase tracking-wide text-white/60">Raw payload</div>
								<SafeValue value={(data as any)?.raw ?? (data as any)?.payload ?? {}} />
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