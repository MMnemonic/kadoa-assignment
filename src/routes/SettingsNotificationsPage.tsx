import { useUi } from '../store/useUi'
import { Link } from 'react-router-dom'

export default function SettingsNotificationsPage() {
	const { theme, setTheme, density, setDensity } = useUi()

	// apply density to document
	if (typeof document !== 'undefined') {
		document.documentElement.setAttribute('data-density', density)
	}

	return (
		<div className="space-y-4">
			<div className="mb-6">
				<Link to="/notifications" className="ui-btn ui-btn--ghost h-10 px-4">{'< Back'}</Link>
			</div>
			<h2 className="text-sm font-semibold">Appearance</h2>
			<div className="ui-card p-4 space-y-3">
				<div className="flex items-center justify-between">
					<label>Theme</label>
					<div className="ui-seg" role="group" aria-label="Theme">
						<button className="ui-segitem" data-active={theme==='light'} aria-pressed={theme==='light'} onClick={()=>setTheme('light')}>Light</button>
						<button className="ui-segitem" data-active={theme==='dark'} aria-pressed={theme==='dark'} onClick={()=>setTheme('dark')}>Dark</button>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<label>Density</label>
					<div className="ui-seg" role="group" aria-label="Density">
						<button className="ui-segitem" data-active={density==='comfortable'} aria-pressed={density==='comfortable'} onClick={()=>setDensity('comfortable')}>Comfort</button>
						<button className="ui-segitem" data-active={density==='compact'} aria-pressed={density==='compact'} onClick={()=>setDensity('compact')}>Compact</button>
					</div>
				</div>
			</div>
		</div>
	)
} 