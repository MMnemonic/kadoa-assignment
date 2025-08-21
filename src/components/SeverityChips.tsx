import clsx from 'clsx'
import { useFilters } from '../store/useFilters'

type Sev = 'info' | 'warning' | 'critical'

interface Props {
	includeInfo?: boolean
	className?: string
}

export default function SeverityChips({ includeInfo = false, className }: Props) {
	const severities = useFilters((s) => s.severities as Set<Sev>)
	const toggleSeverity = useFilters((s) => s.toggleSeverity as (sev: Sev) => void)

	const Chip = ({ sev, label, className }: { sev: Sev; label: string; className?: string }) => {
		const active = severities?.has(sev)
		return (
			<button
				type="button"
				className={clsx(className, active && 'ring-2 ring-[rgb(var(--accent))]/40')}
				aria-pressed={!!active}
				onClick={() => toggleSeverity(sev)}
				data-active={active}
			>
				{label}
			</button>
		)
	}

	return (
		<div className={clsx('flex flex-wrap items-center gap-2', className)}>
			{includeInfo && <Chip sev="info" label="Info" className="ui-chip ui-chip--info" />}
			<Chip sev="warning" label="Warning" className="ui-chip ui-chip--warn" />
			<Chip sev="critical" label="Critical" className="ui-chip ui-chip--crit" />
		</div>
	)
} 