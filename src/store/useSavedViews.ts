import { create } from 'zustand'
import type { SavedView } from '../api/contracts'

export type SavedViewsState = {
	views: SavedView[]
	load: () => void
	save: (v: SavedView) => void
	remove: (id: string) => void
	apply: (v: SavedView) => string
}

export const useSavedViews = create<SavedViewsState>((set, get) => ({
	views: [],
	load() {
		const raw = localStorage.getItem('nc.views')
		set({ views: raw ? JSON.parse(raw) : [] })
	},
	save(v) {
		const all = [...get().views, v]
		localStorage.setItem('nc.views', JSON.stringify(all))
		set({ views: all })
	},
	remove(id) {
		const all = get().views.filter(v => v.id !== id)
		localStorage.setItem('nc.views', JSON.stringify(all))
		set({ views: all })
	},
	apply(v) { return v.query }
})) 