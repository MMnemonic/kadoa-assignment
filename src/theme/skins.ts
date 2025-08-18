export type Skin = 'default' | 'kadoa'
export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'nc.skin'
const THEME_KEY = 'nc.theme'

export function applySkinToDocument(skin: Skin = 'kadoa', theme: Theme = 'light') {
	const root = document.documentElement
	root.setAttribute('data-skin', skin)
	root.setAttribute('data-theme', theme)
	// Toggle Tailwind dark mode
	if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark')
	// For background layer rules
	document.body.setAttribute('data-skin', skin)
	localStorage.setItem(STORAGE_KEY, skin)
	localStorage.setItem(THEME_KEY, theme)
}

export function getInitialSkin(): Skin {
	return (localStorage.getItem(STORAGE_KEY) as Skin) || 'kadoa'
}

export function getInitialTheme(): Theme {
	return (localStorage.getItem(THEME_KEY) as Theme) || 'light'
} 