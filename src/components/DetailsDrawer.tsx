import { Fragment, useEffect, useRef, useState } from 'react'
import { X, ExternalLink } from 'lucide-react'
import type { Notification } from '../api/contracts'
import Portal from '../components/Portal'
import SafeValue, { renderSafeValue } from './SafeValue'
import { Transition } from '@headlessui/react'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

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

	// Lock body scroll while open
	useBodyScrollLock(open)

	// Snapshot the visible item so content doesn't change mid-leave
	const [snapshot, setSnapshot] = useState<Notification | null>(null)
	useEffect(() => {
		if (open && data) setSnapshot(data)
	}, [open, (data as any)?.id])
	const visible: Notification | null = open ? (data ?? snapshot) : snapshot

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

	const bodyKey = (visible as any)?.id ?? 'closed'

	return (
		<Portal>
			<Transition show={open} as={Fragment} appear>
				<div className="fixed inset-0 z-[100] pointer-events-none">
					{/* Overlay with desktop-only fade */}
					<Transition.Child
						as={Fragment}
						enter="duration-0 motion-safe:lg:duration-200"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="duration-0 motion-safe:lg:duration-150"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div
							className="absolute inset-0 bg-black/40 pointer-events-auto"
							onClick={onClose}
							aria-hidden
						/>
					</Transition.Child>

					{/* Sliding panel (desktop only; instant on mobile) */}
					<Transition.Child
						as={Fragment}
						enter="duration-0 motion-safe:lg:duration-300 motion-safe:lg:ease-out motion-reduce:duration-0"
						enterFrom="opacity-100 lg:translate-x-full"
						enterTo="opacity-100 lg:translate-x-0"
						leave="duration-0 motion-safe:lg:duration-300 motion-safe:lg:ease-in motion-reduce:duration-0"
						leaveFrom="opacity-100 lg:translate-x-0"
						leaveTo="opacity-100 lg:translate-x-full"
						afterLeave={() => setSnapshot(null)}
					>
						<aside
							ref={panelRef}
							role="dialog"
							aria-modal="true"
							aria-labelledby="drawer-title"
							tabIndex={-1}
							className="absolute right-0 inset-y-0 w-full lg:max-w-[720px] bg-[rgb(var(--bg-surface))] border-l border-[rgb(var(--border))] shadow-elev-2 pointer-events-auto outline-none will-change-transform"
						>
							{visible && (
								<div key={bodyKey} className="grid h-full grid-rows-[auto,1fr,auto]">
									{/* Header: title + controls + tabs */}
									<div className="row-start-1 sticky top-0 z-10 bg-[rgb(var(--bg-surface))] border-b border-[rgb(var(--border))] px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-4">
										<div className="flex items-center justify-between gap-2 py-1">
											<div className="min-w-0">
												<h2 id="drawer-title" className="truncate text-lg font-semibold">
													{visible.title ?? 'Notification'}
												</h2>
												<div className="mt-1 text-xs text-[rgb(var(--text-muted))] dark:text-white/60 truncate">
													{(visible as any)?.sourceHost ?? ''} • {(visible as any)?.workflowName ?? ''} • {(visible as any)?.severity ?? ''}
												</div>
											</div>
											<div className="flex items-center gap-2">
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
											<SafeValue value={(visible as any)?.summary ?? 'No summary available.'} />
											<div className="flex flex-wrap gap-2">
												{(((visible as any)?.tags) ?? []).map((t: string) => (
													<span key={t} className="ui-chip">{t}</span>
												))}
											</div>
										</section>

										{/* Diff */}
										<section className="space-y-2">
											<div className="text-xs uppercase tracking-wide text-[rgb(var(--text-muted))] dark:text-white/60">Change preview</div>
											{(() => {
												const raw: any = (visible as any)?.diff ?? (visible as any)?.changes
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
											<div className="text-xs uppercase tracking-wide text-[rgb(var(--text-muted))] dark:text-white/60">Raw payload</div>
											<SafeValue value={(visible as any)?.raw ?? (visible as any)?.payload ?? {}} />
										</section>
									</div>

									{/* Footer */}
									<div className="row-start-3 px-4 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] border-t border-[rgb(var(--border))] flex items-center justify-between gap-3">
										<div className="flex gap-2">
											<button className="ui-btn">Mark unread</button>
											<button className="ui-btn">Pin</button>
										</div>
										<div className="flex gap-2">
											<a className="ui-btn" href={(visible as any)?.sourceUrl} target="_blank" rel="noopener noreferrer">
												Open <ExternalLink className="h-4 w-4" />
											</a>
											{(visible as any)?.workflowUrl && (
												<a className="ui-btn" href={(visible as any)?.workflowUrl} target="_blank" rel="noopener noreferrer">Workflow</a>
											)}
											<button className="ui-btn ui-btn--primary" onClick={onClose}>Close</button>
										</div>
									</div>
								</div>
							)}
						</aside>
					</Transition.Child>
				</div>
			</Transition>
		</Portal>
	)
} 