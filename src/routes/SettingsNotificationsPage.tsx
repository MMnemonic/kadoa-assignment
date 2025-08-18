import { useUi } from '../store/useUi'

export default function SettingsNotificationsPage() {
	const { skin, setSkin, theme, setTheme, density, setDensity } = useUi()
	return (
		<div className="space-y-4">
			<h2 className="text-sm font-semibold">Appearance</h2>
			<div className="ui-card p-4 space-y-3">
				<div className="flex items-center justify-between">
					<label>Skin</label>
					<div className="ui-seg" role="group" aria-label="Skin">
						<button className="ui-segitem" data-active={skin==='default'} aria-pressed={skin==='default'} onClick={()=>setSkin('default')}>Default</button>
						<button className="ui-segitem" data-active={skin==='kadoa'} aria-pressed={skin==='kadoa'} onClick={()=>setSkin('kadoa')}>Kadoa</button>
					</div>
				</div>
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