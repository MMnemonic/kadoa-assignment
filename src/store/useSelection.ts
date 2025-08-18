import { create } from 'zustand'

type SelectionState = {
	selectedIds: Set<string>
	toggle: (id: string) => void
	clear: () => void
	selectMany: (ids: string[]) => void
}

export const useSelection = create<SelectionState>((set, get) => ({
	selectedIds: new Set(),
	toggle: (id) => {
		const next = new Set(get().selectedIds)
		if (next.has(id)) next.delete(id); else next.add(id)
		set({ selectedIds: next })
	},
	clear: () => set({ selectedIds: new Set() }),
	selectMany: (ids) => set({ selectedIds: new Set(ids) })
})) 