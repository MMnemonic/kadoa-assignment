import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useNotifications } from '../store/useNotifications'
import { useFilters } from '../store/useFilters'
import { useStickyOffset } from '../hooks/useStickyOffset'
import { parseQuery } from '../url/query'
import HeaderBar from '../components/HeaderBar'
import NotificationList from '../components/NotificationList'
import DetailsDrawer from '../components/DetailsDrawer'
import { useDebouncedCallback } from 'use-debounce'
import Pagination from '../components/Pagination'

export default function NotificationsPage({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
	const location = useLocation()
	const navigate = useNavigate()
	const filters = useFilters()
	const { list, items, order, loading, subscribe, total, page, pageSize } = useNotifications()
	const filtersRef = useRef<HTMLDivElement>(null)
	useStickyOffset({ containerRef: containerRef as unknown as React.RefObject<HTMLElement>, filtersRef: filtersRef as unknown as React.RefObject<HTMLElement>, topbarSelector: '[data-topbar="true"]' })

	useEffect(() => {
		const off = subscribe()
		return () => off()
	}, [subscribe])

	const lastAppliedRef = useRef<string>('')

	// Parse and apply once per navigation event
	useEffect(() => {
		const params = parseQuery(location.search)
		// Apply filters from URL only if different (ignore drawer param `n`)
		const current = new URLSearchParams(location.search)
		current.delete('n')
		const currentQs = current.toString()
		if (filters.toSearch() !== currentQs) {
			filters.fromSearch(location.search)
		}
		;(async () => {
			try {
				await list(params)
			} finally {}
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.key])

	// Debounced store -> URL sync
	const pushSearch = useDebouncedCallback((next: string) => {
		// Preserve drawer param `n` while syncing filters
		const merged = new URLSearchParams(next)
		const curr = new URLSearchParams(location.search)
		const n = curr.get('n')
		if (n) merged.set('n', n)
		const qs = `?${merged.toString()}`
		if (qs !== location.search && qs !== lastAppliedRef.current) {
			lastAppliedRef.current = qs
			navigate({ pathname: '/notifications', search: qs }, { replace: true })
		}
	}, 120)

	useEffect(() => {
		const next = filters.toSearch()
		pushSearch(next)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters.q, filters.unread, filters.severities, filters.workflowIds, filters.sort, filters.range, filters.page, filters.pageSize])

	// Clamp page if out of range
	useEffect(() => {
		const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)))
		if (page > totalPages) {
			filters.set({ page: totalPages })
		}
	}, [total, page, pageSize])

	const listItems = order.map(id => items.get(id)!).filter(Boolean)

	const handleClearFilters = () => {
		filters.set({ q: undefined, unread: undefined, severities: new Set(), workflowIds: new Set(), sort: undefined, range: undefined, page: 1 })
	}

	// Drawer param wiring
	const params = new URLSearchParams(location.search)
	const openId = params.get('n') || undefined
	const current = openId ? items.get(openId) ?? null : null
	const setOpen = (id?: string) => {
		const next = new URLSearchParams(location.search)
		if (!id) next.delete('n'); else next.set('n', id)
		navigate({ pathname: '/notifications', search: '?' + next.toString() }, { replace: true })
	}

	const onChangePage = (nextPage: number) => {
		if (nextPage < 1) return
		filters.set({ page: nextPage })
	}

	return (
		<div className="space-y-4">
			<HeaderBar />
			<section className="ui-card ui-glass">
				<NotificationList items={listItems as any} loading={loading} onOpen={setOpen} selectedId={openId} onClearFilters={handleClearFilters} />
				<div className="mt-4">
					<Pagination page={page} pageSize={pageSize} total={total} onPageChange={onChangePage} />
				</div>
			</section>
			<DetailsDrawer open={!!openId} onClose={() => setOpen(undefined)} data={current as any} />
		</div>
	)
} 