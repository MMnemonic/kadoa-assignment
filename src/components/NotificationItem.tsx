import React from 'react'

type Props = {
	n: {
		id: string
		title: string
		sourceUrl: string
		workflowName: string
		severity: 'info'|'warning'|'critical'
		unread: boolean
	}
}

export default function NotificationItem({ n }: Props) {
	const domain = new URL(n.sourceUrl).hostname
	return (
		<li className="ui-card ui-card-hover p-5 transition-[transform,box-shadow] duration-150">
			<div className="flex items-start justify-between gap-3">
				<div className="flex-1">
					<div className="flex items-center gap-2">
						{n.unread && <span className="unread-dot animate-[pop_.18s_ease-out_both]" aria-label="Unread" />}
						<h3 className="font-semibold tracking-tight text-[15px]">{n.title}</h3>
						<span className="text-xs text-[rgb(var(--text-muted))]">{domain}</span>
					</div>
					<div className="text-xs text-[rgb(var(--text-muted))] flex items-center gap-2 mt-2">
						<span className={`ui-chip ${n.severity==='warning'?'ui-chip--warn': n.severity==='critical'?'ui-chip--crit':'ui-chip--info'}`}>{n.severity}</span>
						<span className="ui-chip">{n.workflowName}</span>
					</div>
				</div>
				<a href={n.sourceUrl} target="_blank" rel="noopener" className="ui-btn ui-btn--ghost focus-ring">Open ↗</a>
			</div>
		</li>
	)
} 