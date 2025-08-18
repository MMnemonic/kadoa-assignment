import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useNotifications } from '../store/useNotifications'
import { useFilters } from '../store/useFilters'
import { useStickyOffset } from '../hooks/useStickyOffset'
import { buildQuery, parseQuery } from '../url/query'
import { mockApi } from '../api/mockAdapter'
import { RefreshCcw, Search } from 'lucide-react'
import SeverityChips from '../components/SeverityChips'
import WorkflowFilter from '../components/WorkflowFilter'

export default function NotificationsPage({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
	const location = useLocation()
	const navigate = useNavigate()
	const filters = useFilters()
	const { list, items, order, loading, subscribe } = useNotifications()
	const filtersRef = useRef<HTMLDivElement>(null)
	useStickyOffset({ containerRef, filtersRef, topbarSelector: '[data-topbar="true"]' })

	useEffect(() => { filters.fromSearch(location.search) }, [])
	useEffect(() => { list(parseQuery(location.search)) }, [location.search])
	useEffect(() => {
		const unsub = subscribe()
		return () => unsub()
	}, [])

	// Sync store -> URL
	useEffect(() => {
		const search = filters.toSearch()
		const current = location.search.replace(/^\?/, '')
		if (search !== current) navigate({ pathname: '/notifications', search: '?' + search }, { replace: true })
	}, [filters.q, filters.unread, filters.severities, filters.workflowIds, filters.sort, filters.range])

	return (
		<div className="space-y-4">
			<section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
				<div className="ui-kpi"><div>Unread</div><strong>{Array.from(items.values()).filter(n=>n.unread).length}</strong></div>
				<div className="ui-kpi"><div>Critical (24h)</div><strong>{Array.from(items.values()).filter(n=>n.severity==='critical').length}</strong></div>
				<div className="ui-kpi"><div>New today</div><strong>{order.slice(0,10).length}</strong></div>
			</section>
			<section ref={filtersRef} className="ui-card p-3 flex items-center gap-2 flex-wrap">
				<div className="flex-1 min-w-[220px]">
					<label className="sr-only" htmlFor="search">Search</label>
					<div className="relative">
						<input id="search" className="ui-field pl-8" placeholder="Search (Ctrl+/)" value={filters.q||''} onChange={(e)=>filters.set({ q: e.target.value })} />
						<Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
					</div>
				</div>
				<div className="ui-seg h-10" role="group" aria-label="Unread">
					<button className="ui-segitem" data-active={filters.unread===undefined||filters.unread===false} aria-pressed={(filters.unread??false)===false} onClick={()=>filters.set({ unread: undefined })}>All</button>
					<button className="ui-segitem" data-active={filters.unread===true} aria-pressed={filters.unread===true} onClick={()=>filters.set({ unread: true })}>Unread</button>
				</div>
				<SeverityChips />
				<WorkflowFilter />
				<button className="ui-iconbtn ml-auto" title="Refresh" onClick={()=>list(parseQuery(location.search))}><RefreshCcw className="h-4 w-4" /></button>
			</section>
			<section className="ui-card">
				<ul role="list" className="divide-y divide-[var(--border)]">
					{order.map(id => {
						const n = items.get(id)!; return (
							<li key={id} className="p-3 hover:bg-[color-mix(in_oklab,var(--surface-0),#000_3%)] focus-within:ring-2 focus-within:ring-brand-500">
								<div className="flex items-start justify-between gap-3">
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											{n.unread && <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden />}
											<span className="font-medium">{n.title}</span>
											<span className="text-xs text-[var(--muted)]">{new URL(n.sourceUrl).hostname}</span>
										</div>
										<div className="text-xs text-[var(--muted)] flex items-center gap-2">
											<span className={`ui-chip ${n.severity==='warning'?'ui-chip--warn': n.severity==='critical'?'ui-chip--crit':''}`}>{n.severity}</span>
											<span className="ui-chip">{n.workflowName}</span>
										</div>
									</div>
									<a href={n.sourceUrl} target="_blank" rel="noopener" className="ui-btn">Open ↗</a>
								</div>
							</li>
						)
					})}
				</ul>
			</section>
		</div>
	)
} 