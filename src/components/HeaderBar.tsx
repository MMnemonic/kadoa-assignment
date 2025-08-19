import { useEffect, useRef } from 'react'
import { RefreshCcw, Search } from 'lucide-react'
import { useNotifications } from '../store/useNotifications'
import { useFilters } from '../store/useFilters'
import SeverityChips from './SeverityChips'
import WorkflowFilter from './WorkflowFilter'
import { parseQuery } from '../url/query'
import { useLocation } from 'react-router-dom'

export default function HeaderBar() {
	const { items, order, list } = useNotifications()
	const filters = useFilters()
	const location = useLocation()
	const toolbarRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const onScroll = () => {
			if (!toolbarRef.current) return
			toolbarRef.current.dataset.scrolled = window.scrollY > 4 ? 'true' : 'false'
		}
		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	const handleRefresh = () => list(parseQuery(location.search))

	return (
		<div className="space-y-4">
			<section className="ui-card ui-glass">
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
					<div className="ui-kpi" aria-label="Unread KPI"><div>Unread</div><strong className="ui-kpi__value">{Array.from(items.values()).filter(n=>n.unread).length}</strong></div>
					<div className="ui-kpi" aria-label="Critical 24h KPI"><div>Critical (24h)</div><strong className="ui-kpi__value">{Array.from(items.values()).filter(n=>n.severity==='critical').length}</strong></div>
					<div className="ui-kpi" aria-label="New today KPI"><div>New today</div><strong className="ui-kpi__value">{order.slice(0,10).length}</strong></div>
				</div>
			</section>
			<section ref={toolbarRef} className="ui-glass p-3 ui-sticky">
				<div className="grid gap-3">
					{/* Row 1 — Search */}
					<div className="flex items-center gap-2">
						<div className="relative w-full min-w-0">
							<label className="sr-only" htmlFor="search">Search</label>
							<input id="search" className="ui-field pl-8 w-full h-11 focus-ring" placeholder="Search (Ctrl+/)" value={filters.q||''} onChange={(e)=>filters.set({ q: e.target.value })} />
							<Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))]" />
						</div>
					</div>

					{/* Row 2 — Filters + Refresh */}
					<div className="flex flex-wrap items-center gap-2">
						<div className="ui-seg h-11" role="group" aria-label="Unread">
							<button className="ui-segitem focus-ring" data-active={filters.unread===undefined||filters.unread===false} aria-pressed={(filters.unread??false)===false} onClick={()=>filters.set({ unread: undefined })}>All</button>
							<button className="ui-segitem focus-ring" data-active={filters.unread===true} aria-pressed={filters.unread===true} onClick={()=>filters.set({ unread: true })}>Unread</button>
						</div>
						<SeverityChips />
						<WorkflowFilter />
						<button type="button" onClick={handleRefresh} className="ui-iconbtn ml-auto shrink-0" aria-label="Refresh" title="Refresh">
							<RefreshCcw className="h-5 w-5" aria-hidden="true" />
						</button>
					</div>
				</div>
			</section>
		</div>
	)
} 