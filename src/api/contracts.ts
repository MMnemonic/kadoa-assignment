export type Severity = 'info' | 'warning' | 'critical'

export type Notification = {
	id: string
	title: string
	sourceUrl: string
	sourceDomain: string
	workflowId: string
	workflowName: string
	severity: Severity
	createdAtISO: string
	unread: boolean
	pinned: boolean
	tags?: string[]
	diff?: { field: string; before: any; after: any }[]
	snoozedUntil?: string | null
}

export type Workflow = { id: string; name: string; count?: number }

export type SavedView = { id: string; name: string; query: string }

export type ListNotificationsParams = {
	q?: string
	unread?: boolean
	severity?: ('warning' | 'critical')[]
	workflowIds?: string[]
	sort?: 'newest' | 'oldest'
	range?: '24h' | '7d' | 'all'
} 