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

	return (
		<div className="space-y-4">
			<section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
				<div className="ui-kpi" aria-label="Unread KPI"><div>Unread</div><strong className="ui-kpi__value">{Array.from(items.values()).filter(n=>n.unread).length}</strong></div>
				<div className="ui-kpi" aria-label="Critical 24h KPI"><div>Critical (24h)</div><strong className="ui-kpi__value">{Array.from(items.values()).filter(n=>n.severity==='critical').length}</strong></div>
				<div className="ui-kpi" aria-label="New today KPI"><div>New today</div><strong className="ui-kpi__value">{order.slice(0,10).length}</strong></div>
			</section>
			<section ref={toolbarRef} className="toolbar ui-sticky">
				<div className="grid grid-cols-12 gap-3 items-center">
					<div className="col-span-12 lg:col-span-8 flex flex-wrap items-center gap-2">
						<div className="relative w-full max-w-[min(42rem,100%)]">
							<label className="sr-only" htmlFor="search">Search</label>
							<input id="search" className="ui-field pl-8 w-full h-11 focus-ring" placeholder="Search (Ctrl+/)" value={filters.q||''} onChange={(e)=>filters.set({ q: e.target.value })} />
							<Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))]" />
						</div>
						<div className="ui-seg h-11" role="group" aria-label="Unread">
							<button className="ui-segitem focus-ring" data-active={filters.unread===undefined||filters.unread===false} aria-pressed={(filters.unread??false)===false} onClick={()=>filters.set({ unread: undefined })}>All</button>
							<button className="ui-segitem focus-ring" data-active={filters.unread===true} aria-pressed={filters.unread===true} onClick={()=>filters.set({ unread: true })}>Unread</button>
						</div>
						<SeverityChips />
						<WorkflowFilter />
					</div>
					<div className="col-span-12 lg:col-span-4 flex justify-end gap-2">
						<button className="ui-btn h-11 focus-ring" title="Refresh" onClick={()=>list(parseQuery(location.search))}><RefreshCcw className="h-4 w-4" /></button>
					</div>
				</div>
			</section>
		</div>
	)
} 