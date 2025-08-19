import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

export default function Portal({ children, id = 'portal-root' }: { children: React.ReactNode; id?: string }) {
	const host = useMemo(() => {
		let el = document.getElementById(id)
		if (!el) {
			el = document.createElement('div')
			el.id = id
			document.body.appendChild(el)
		}
		return el
	}, [id])

	useEffect(() => {
		return () => {
			// no-op: shared portal root persists for app lifetime
		}
	}, [])

	return createPortal(children, host)
} 