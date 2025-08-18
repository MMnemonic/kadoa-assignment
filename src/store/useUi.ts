import { create } from 'zustand'
import { applySkinToDocument, getInitialSkin, getInitialTheme, type Skin, type Theme } from '../theme/skins'

type Density = 'comfortable' | 'compact'

type UiState = {
	skin: Skin
	theme: Theme
	density: Density
	lastSeenAt: string
	setSkin: (s: Skin) => void
	setTheme: (t: Theme) => void
	setDensity: (d: Density) => void
	setLastSeen: (iso: string) => void
}

export const useUi = create<UiState>((set, get) => {
	const skin = getInitialSkin()
	const theme = getInitialTheme()
	applySkinToDocument(skin, theme)
	return {
		skin,
		theme,
		density: 'comfortable',
		lastSeenAt: new Date().toISOString(),
		setSkin: (s) => { applySkinToDocument(s, get().theme); set({ skin: s }) },
		setTheme: (t) => { applySkinToDocument(get().skin, t); set({ theme: t }) },
		setDensity: (d) => set({ density: d }),
		setLastSeen: (iso) => set({ lastSeenAt: iso }),
	}
}) 