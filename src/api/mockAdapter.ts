import { addDays, addHours, formatISO, subDays } from 'date-fns'
import { nanoid } from 'nanoid'
import type { ListNotificationsParams, Notification, SavedView, Workflow, ListNotificationsResult } from './contracts'

// Small nanoid fallback if not installed
function id() { try { return nanoid() } catch { return Math.random().toString(36).slice(2) } }

const WORKFLOWS: Workflow[] = [
	{ id: 'hn', name: 'Hacker News' },
	{ id: 'pricing', name: 'Pricing' },
	{ id: 'reg', name: 'Regulatory' },
	{ id: 'blog', name: 'Blog' },
	{ id: 'social', name: 'Social' },
]

const DOMAINS = {
	hn: 'news.ycombinator.com',
	pricing: 'kadoa.com',
	reg: 'ec.europa.eu',
	blog: 'blog.kadoa.com',
	social: 'twitter.com'
} as const

let items: Notification[] = []

function seed() {
	if (items.length) return
	const severities: Notification['severity'][] = ['info','warning','critical']
	const titles = [
		'Workflow completed successfully',
		'Price change detected',
		'Policy update requires attention',
		'New comment on blog post',
		'Mention on social platform'
	]
	let now = new Date()
	for (let i = 0; i < 120; i++) {
		const wf = WORKFLOWS[i % WORKFLOWS.length]
		const sev = severities[i % severities.length]
		const created = addHours(subDays(now, Math.floor(i/6)), -i)
		items.push({
			id: id(),
			title: titles[i % titles.length],
			sourceUrl: `https://${DOMAINS[wf.id as keyof typeof DOMAINS]}/item/${1000+i}`,
			sourceDomain: DOMAINS[wf.id as keyof typeof DOMAINS],
			workflowId: wf.id,
			workflowName: wf.name,
			severity: sev,
			createdAtISO: formatISO(created),
			unread: Math.random() > 0.4,
			pinned: Math.random() > 0.85,
			tags: Math.random() > 0.6 ? ['system'] : undefined,
			diff: Math.random() > 0.5 ? [{ field: 'price', before: 19, after: 29 }] : undefined,
			snoozedUntil: null,
		})
	}
}
seed()

function matches(n: Notification, p: ListNotificationsParams): boolean {
	if (p.q) {
		const q = p.q.toLowerCase()
		if (!n.title.toLowerCase().includes(q) && !n.sourceDomain.toLowerCase().includes(q)) return false
	}
	if (p.unread && !n.unread) return false
	if (p.severity && p.severity.length && !p.severity.includes(n.severity as any)) return false
	if (p.workflowIds && p.workflowIds.length && !p.workflowIds.includes(n.workflowId)) return false
	return true
}

export const mockApi = {
	async list(params: ListNotificationsParams): Promise<ListNotificationsResult> {
		const filtered = items
			.filter((n) => !n.snoozedUntil || new Date(n.snoozedUntil) < new Date())
			.filter((n) => matches(n, params))
		filtered.sort((a,b) => (params.sort === 'oldest' ? 1 : -1) * (a.createdAtISO.localeCompare(b.createdAtISO)))
		const total = filtered.length
		const pageSize = Math.max(1, params.pageSize ?? 10)
		const page = Math.max(1, params.page ?? 1)
		const start = (page - 1) * pageSize
		const end = start + pageSize
		const pageItems = filtered.slice(start, end)
		return {
			items: structuredClone(pageItems),
			total,
			page,
			pageSize,
		}
	},
	async markRead(idOrIds: string | string[]) {
		const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds]
		items.forEach((n) => { if (ids.includes(n.id)) n.unread = false })
	},
	async markUnread(idOrIds: string | string[]) {
		const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds]
		items.forEach((n) => { if (ids.includes(n.id)) n.unread = true })
	},
	async pin(id: string) { const n = items.find(i => i.id === id); if (n) n.pinned = true },
	async unpin(id: string) { const n = items.find(i => i.id === id); if (n) n.pinned = false },
	async listWorkflows(): Promise<Workflow[]> {
		const counts = new Map<string, number>()
		for (const i of items) counts.set(i.workflowId, (counts.get(i.id) || 0) + (i.unread ? 1 : 0))
		return WORKFLOWS.map(w => ({ ...w, count: counts.get(w.id) || 0 }))
	},
	async listSavedViews(): Promise<SavedView[]> {
		const raw = localStorage.getItem('nc.views')
		return raw ? JSON.parse(raw) : []
	},
	async saveView(view: SavedView) {
		const all = await this.listSavedViews()
		const exists = all.some(v => v.name.toLowerCase() === view.name.toLowerCase())
		if (exists) throw new Error('Name already exists')
		all.push(view)
		localStorage.setItem('nc.views', JSON.stringify(all))
	},
	async deleteView(id: string) {
		const all = await this.listSavedViews()
		localStorage.setItem('nc.views', JSON.stringify(all.filter(v => v.id !== id)))
	},
	subscribe(cb: (newOnes: Notification[]) => void) {
		const handle = setInterval(() => {
			const howMany = 1 + Math.floor(Math.random()*3)
			const now = new Date()
			const created: Notification[] = []
			for (let i=0;i<howMany;i++) {
				const wf = WORKFLOWS[Math.floor(Math.random()*WORKFLOWS.length)]
				const n: Notification = {
					id: id(),
					title: 'New event detected',
					sourceUrl: `https://${DOMAINS[wf.id as keyof typeof DOMAINS]}/item/${Math.floor(Math.random()*9999)}`,
					sourceDomain: DOMAINS[wf.id as keyof typeof DOMAINS],
					workflowId: wf.id,
					workflowName: wf.name,
					severity: Math.random() > 0.7 ? 'critical' : (Math.random() > 0.5 ? 'warning' : 'info'),
					createdAtISO: formatISO(addDays(now, 0)),
					unread: true,
					pinned: false,
					tags: ['auto'],
				}
				items.unshift(n)
				created.push(n)
			}
			cb(created)
		}, 20000)
		return () => clearInterval(handle)
	}
} 