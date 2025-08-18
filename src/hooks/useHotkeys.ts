import { useEffect } from 'react'

export type Hotkeys = {
	focusSearch?: () => void
	open?: () => void
	refresh?: () => void
	pin?: () => void
	markRead?: () => void
	markUnread?: () => void
	gotoCritical?: () => void
	gotoUnread?: () => void
}

export function useHotkeys(keys: Hotkeys) {
	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			const k = e.key.toLowerCase()
			if ((e.ctrlKey || e.metaKey) && k === '/') { e.preventDefault(); keys.focusSearch?.() }
			if (k === 'o') { e.preventDefault(); keys.open?.() }
			if (k === 'r') { e.preventDefault(); keys.refresh?.() }
			if (k === 'p') { e.preventDefault(); keys.pin?.() }
			if (k === ']') { e.preventDefault(); keys.markRead?.() }
			if (k === '[') { e.preventDefault(); keys.markUnread?.() }
			if (k === 'k' && e.shiftKey) { e.preventDefault(); keys.gotoCritical?.() }
			if (k === 'u' && e.shiftKey) { e.preventDefault(); keys.gotoUnread?.() }
		}
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
	}, [keys])
} 