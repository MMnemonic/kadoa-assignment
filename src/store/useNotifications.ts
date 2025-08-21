import { create } from 'zustand'
import type { ListNotificationsParams, Notification, ListNotificationsResult } from '../api/contracts'
import { mockApi } from '../api/mockAdapter'

export type NotificationsState = {
	items: Map<string, Notification>
	order: string[]
	loading: boolean
	error?: string
	total: number
	page: number
	pageSize: number
	list: (params: ListNotificationsParams) => Promise<void>
	markRead: (id: string | string[]) => Promise<void>
	markUnread: (id: string | string[]) => Promise<void>
	pin: (id: string) => Promise<void>
	unpin: (id: string) => Promise<void>
	subscribe: () => () => void
}

export const useNotifications = create<NotificationsState>((set, get) => ({
	items: new Map(),
	order: [],
	loading: false,
	total: 0,
	page: 1,
	pageSize: 10,
	async list(params) {
		set({ loading: true, error: undefined })
		try {
			const data: ListNotificationsResult = await mockApi.list(params)
			const map = new Map<string, Notification>()
			for (const n of data.items) map.set(n.id, n)
			set({ items: map, order: data.items.map(d => d.id), total: data.total, page: data.page, pageSize: data.pageSize })
		} catch (e: any) {
			console.error('listNotifications failed', e)
			set({ error: String(e) })
		} finally {
			set({ loading: false })
		}
	},
	async markRead(id) {
		await mockApi.markRead(id)
		const ids = Array.isArray(id) ? id : [id]
		const map = new Map(get().items)
		ids.forEach((i) => { const n = map.get(i); if (n) n.unread = false })
		set({ items: map })
	},
	async markUnread(id) {
		await mockApi.markUnread(id)
		const ids = Array.isArray(id) ? id : [id]
		const map = new Map(get().items)
		ids.forEach((i) => { const n = map.get(i); if (n) n.unread = true })
		set({ items: map })
	},
	async pin(id) {
		await mockApi.pin(id)
		const map = new Map(get().items)
		const n = map.get(id); if (n) n.pinned = true
		set({ items: map })
	},
	async unpin(id) {
		await mockApi.unpin(id)
		const map = new Map(get().items)
		const n = map.get(id); if (n) n.pinned = false
		set({ items: map })
	},
	subscribe() { return mockApi.subscribe((newOnes) => {
		const map = new Map(get().items)
		const order = [...get().order]
		for (const n of newOnes) { map.set(n.id, n); if (!order.includes(n.id)) order.unshift(n.id) }
		set({ items: map, order, total: get().total + newOnes.length })
	}) }
})) 