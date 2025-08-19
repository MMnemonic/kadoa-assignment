import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useNotifications } from '../store/useNotifications'
import { useFilters } from '../store/useFilters'
import { useStickyOffset } from '../hooks/useStickyOffset'
import { buildQuery, parseQuery } from '../url/query'
import { mockApi } from '../api/mockAdapter'
import HeaderBar from '../components/HeaderBar'
import NotificationList from '../components/NotificationList'
import DetailsDrawer from '../components/DetailsDrawer'

export default function NotificationsPage({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
	const location = useLocation()
	const navigate = useNavigate()
	const filters = useFilters()
	const { list, items, order, loading, subscribe } = useNotifications()
	const filtersRef = useRef<HTMLDivElement>(null)
	useStickyOffset({ containerRef, filtersRef, topbarSelector: '[data-topbar="true"]' })

	const [offsetPx, setOffsetPx] = useState(96)
	useEffect(() => {
		const measure = () => {
			const topbar = document.querySelector<HTMLElement>('[data-topbar="true"]')
			const a = topbar?.getBoundingClientRect().height ?? 0
			const b = filtersRef.current?.getBoundingClientRect().height ?? 0
			setOffsetPx(Math.round(a + b + 8))
		}
		measure()
		const ro = new ResizeObserver(measure)
		const topbar = document.querySelector<HTMLElement>('[data-topbar="true"]')
		topbar && ro.observe(topbar)
		filtersRef.current && ro.observe(filtersRef.current)
		window.addEventListener('resize', measure)
		return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
	}, [])

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

	const listItems = order.map(id => items.get(id)!).filter(Boolean)

	// Drawer param wiring
	const params = new URLSearchParams(location.search)
	const openId = params.get('n') || undefined
	const currentIdx = openId ? order.findIndex(id => id === openId) : -1
	const current = openId ? items.get(openId) ?? null : null
	const setOpen = (id?: string) => {
		const next = new URLSearchParams(location.search)
		if (!id) next.delete('n'); else next.set('n', id)
		navigate({ pathname: '/notifications', search: '?' + next.toString() }, { replace: true })
	}
	const onPrev = () => { if (currentIdx > 0) setOpen(order[currentIdx - 1]) }
	const onNext = () => { if (currentIdx >= 0 && currentIdx < order.length - 1) setOpen(order[currentIdx + 1]) }

	return (
		<div className="space-y-4">
			<HeaderBar />
			<section className="ui-card ui-glass">
				<NotificationList items={listItems as any} loading={loading} onOpen={setOpen} />
			</section>
			<DetailsDrawer open={!!openId} onClose={() => setOpen(undefined)} onPrev={currentIdx > 0 ? onPrev : undefined} onNext={currentIdx >= 0 && currentIdx < order.length - 1 ? onNext : undefined} data={current as any} />
		</div>
	)
} 