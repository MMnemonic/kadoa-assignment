import React from 'react'

export function renderSafeValue(v: unknown): React.ReactNode {
	if (v === null || v === undefined) return <span className="text-white/40">—</span>
	const t = typeof v
	if (t === 'string' || t === 'number' || t === 'boolean') return String(v)
	try {
		return (
			<pre className="whitespace-pre-wrap break-words text-xs leading-snug bg-white/5 rounded-lg p-2 border border-white/10">
				{JSON.stringify(v, null, 2)}
			</pre>
		)
	} catch {
		return <span className="text-[rgb(var(--text-muted))] dark:text-white/60">[unrenderable value]</span>
	}
}

export default function SafeValue({ value }: { value: unknown }) {
	return <>{renderSafeValue(value)}</>
} 