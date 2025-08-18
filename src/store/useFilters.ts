import { create } from 'zustand'
import type { ListNotificationsParams } from '../api/contracts'
import { buildQuery, parseQuery } from '../url/query'

export type FiltersState = {
	q?: string
	unread?: boolean
	severities: Set<'info' | 'warning' | 'critical'>
	workflowIds: Set<string>
	sort?: 'newest' | 'oldest'
	range?: '24h' | '7d' | 'all'
	set: (patch: Partial<FiltersState>) => void
	fromSearch: (search: string) => void
	toSearch: () => string
	toggleSeverity: (sev: 'info' | 'warning' | 'critical') => void
	toggleWorkflow: (id: string) => void
	clearWorkflows: () => void
}

export const useFilters = create<FiltersState>((set, get) => ({
	severities: new Set(),
	workflowIds: new Set(),
	set: (patch) => set({ ...get(), ...patch }),
	fromSearch(search) {
		const p = parseQuery(search)
		set({
			q: p.q,
			unread: p.unread,
			severities: new Set(p.severity as any),
			workflowIds: new Set(p.workflowIds),
			sort: p.sort,
			range: p.range,
		})
	},
	toSearch() {
		const onlyWarnCrit = Array.from(get().severities).filter(s => s !== 'info') as ('warning'|'critical')[]
		const p: ListNotificationsParams = {
			q: get().q,
			unread: get().unread,
			severity: onlyWarnCrit,
			workflowIds: Array.from(get().workflowIds),
			sort: get().sort,
			range: get().range
		}
		return buildQuery(p)
	},
	toggleSeverity(sev) {
		const next = new Set(get().severities)
		if (next.has(sev)) next.delete(sev); else next.add(sev)
		set({ severities: next })
	},
	toggleWorkflow(id) {
		const next = new Set(get().workflowIds)
		if (next.has(id)) next.delete(id); else next.add(id)
		set({ workflowIds: next })
	},
	clearWorkflows() { set({ workflowIds: new Set() }) }
})) 