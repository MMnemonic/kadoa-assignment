import { create } from 'zustand'
import type { ListNotificationsParams, Notification } from '../api/contracts'
import { mockApi } from '../api/mockAdapter'

export type NotificationsState = {
	items: Map<string, Notification>
	order: string[]
	loading: boolean
	error?: string
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
	async list(params) {
		set({ loading: true, error: undefined })
		try {
			const data = await mockApi.list(params)
			const map = new Map<string, Notification>()
			for (const n of data) map.set(n.id, n)
			set({ items: map, order: data.map(d => d.id), loading: false })
		} catch (e: any) { set({ error: String(e), loading: false }) }
	},
	async markRead(id) { await mockApi.markRead(id); },
	async markUnread(id) { await mockApi.markUnread(id); },
	async pin(id) { await mockApi.pin(id) },
	async unpin(id) { await mockApi.unpin(id) },
	subscribe() { return mockApi.subscribe((newOnes) => {
		const map = new Map(get().items)
		const order = [...get().order]
		for (const n of newOnes) { map.set(n.id, n); order.unshift(n.id) }
		set({ items: map, order })
	}) }
})) 