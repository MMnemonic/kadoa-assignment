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
					<div className="flex items-center">
						<div className="relative w-full min-w-0">
							<label className="sr-only" htmlFor="search">Search</label>
							<input id="search" className="ui-field pl-8 w-full min-w-0 h-10 sm:h-11 text-sm sm:text-base focus-ring placeholder:text-[rgb(var(--text-muted))] dark:placeholder:text-white/60" placeholder="Search (Ctrl+/)" value={filters.q||''} onChange={(e)=>filters.set({ q: e.target.value })} />
							<Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))]" />
						</div>
					</div>

					{/* Row 2A — Segmented + Severity (mobile), collapses on >=sm */}
					<div className="flex items-center gap-2 sm:gap-3 flex-wrap overflow-x-auto no-scrollbar -mx-1 px-1 sm:overflow-visible">
						<div className="shrink-0">
							<div className="ui-seg" role="group" aria-label="Read state">
								<button type="button" className="ui-segitem" aria-pressed={!filters.unread} data-active={!filters.unread} onClick={() => filters.set({ unread: undefined })}>All</button>
								<button type="button" className="ui-segitem" aria-pressed={!!filters.unread} data-active={!!filters.unread} onClick={() => filters.set({ unread: true })}>Unread</button>
							</div>
						</div>
						<SeverityChips className="text-sm" />

						{/* On >=sm we also place Workflows + Refresh on this same line */}
						<div className="hidden sm:flex items-center gap-2 ml-auto">
							<WorkflowFilter />
							<button type="button" onClick={handleRefresh} className="ui-iconbtn h-10 w-10" aria-label="Refresh" title="Refresh">
								<RefreshCcw className="h-5 w-5" aria-hidden="true" />
							</button>
						</div>
					</div>

					{/* Row 2B — Workflows + Refresh (mobile only) */}
					<div className="flex items-center gap-2 sm:hidden">
						<WorkflowFilter className="flex-1" />
						<button type="button" onClick={handleRefresh} className="ui-iconbtn ml-auto h-9 w-9" aria-label="Refresh" title="Refresh">
							<RefreshCcw className="h-5 w-5" aria-hidden="true" />
						</button>
					</div>
				</div>
			</section>
		</div>
	)
} 