import React from 'react'
import NotificationItem from './NotificationItem'

type Notification = {
	id: string
	title: string
	sourceUrl: string
	workflowName: string
	severity: 'info'|'warning'|'critical'
	createdAtISO: string
	unread: boolean
}

type Props = {
	items: Notification[]
	onClearFilters?: () => void
	loading?: boolean
	onOpen?: (id: string) => void
	selectedId?: string
}

function groupByDate(items: Notification[]) {
	const today = new Date()
	const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
	const startOfYesterday = new Date(startOfToday)
	startOfYesterday.setDate(startOfYesterday.getDate() - 1)
	const groups: Record<string, Notification[]> = { Today: [], Yesterday: [], Earlier: [] }
	for (const n of items) {
		const d = new Date(n.createdAtISO)
		if (d >= startOfToday) groups['Today'].push(n)
		else if (d >= startOfYesterday) groups['Yesterday'].push(n)
		else groups['Earlier'].push(n)
	}
	return groups
}

export default function NotificationList({ items, onClearFilters, loading, onOpen, selectedId }: Props) {
	if (loading) {
		return (
			<ul className="space-y-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<li key={i} className="ui-card p-5 skeleton h-16" />
				))}
			</ul>
		)
	}
	if (!items.length) {
		return (
			<div className="ui-card p-8 text-center">
				<p className="mb-3">No notifications match your filters.</p>
				{onClearFilters && <button className="ui-btn ui-btn--primary focus-ring" onClick={onClearFilters}>Clear filters</button>}
			</div>
		)
	}
	const groups = groupByDate(items)
	return (
		<ul role="list" className="space-y-2">
			{(['Today','Yesterday','Earlier'] as const).map((label) => (
				groups[label].length ? (
					<li key={label}>
						<div data-group={label} className="group-header">{label}</div>
						<ul className="space-y-3 sm:space-y-4">
							{groups[label].map(n => (<NotificationItem key={n.id} item={n as any} onOpen={onOpen!} selectedId={selectedId} />))}
						</ul>
					</li>
				) : null
			))}
		</ul>
	)
} 