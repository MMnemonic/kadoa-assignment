export type Severity = 'warning' | 'critical'

export type ListParams = {
	q?: string
	unread?: boolean
	severity?: Severity[]
	workflowIds?: string[]
	sort?: 'newest' | 'oldest'
	range?: '24h' | '7d' | 'all'
}

export function parseQuery(search: string): ListParams {
	const p = new URLSearchParams(search)
	const q = p.get('q') || undefined
	const unread = p.get('unread') === '1' ? true : undefined
	const severity = p.getAll('sev') as Severity[]
	const workflowIds = p.getAll('wf')
	const sort = (p.get('sort') as ListParams['sort']) || undefined
	const range = (p.get('range') as ListParams['range']) || undefined
	return { q, unread, severity: severity.length ? severity : undefined, workflowIds: workflowIds.length ? workflowIds : undefined, sort, range }
}

export function buildQuery(params: ListParams): string {
	const p = new URLSearchParams()
	if (params.q) p.set('q', params.q)
	if (params.unread) p.set('unread', '1')
	params.severity?.forEach((s) => p.append('sev', s))
	params.workflowIds?.forEach((id) => p.append('wf', id))
	if (params.sort) p.set('sort', params.sort)
	if (params.range) p.set('range', params.range)
	return p.toString()
} 