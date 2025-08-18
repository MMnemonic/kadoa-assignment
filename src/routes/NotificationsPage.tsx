import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useNotifications } from '../store/useNotifications'
import { useFilters } from '../store/useFilters'
import { useStickyOffset } from '../hooks/useStickyOffset'
import { buildQuery, parseQuery } from '../url/query'
import { mockApi } from '../api/mockAdapter'
import HeaderBar from '../components/HeaderBar'
import NotificationList from '../components/NotificationList'

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

	const listItems = order.map(id => items.get(id)!).filter(Boolean)

	return (
		<div className="space-y-4">
			<HeaderBar />
			<section className="ui-card">
				<NotificationList items={listItems as any} loading={loading} />
			</section>
		</div>
	)
} 