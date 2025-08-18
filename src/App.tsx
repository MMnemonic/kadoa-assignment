import { useEffect, useRef } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Sun, Moon, Settings } from 'lucide-react'
import { useUi } from './store/useUi'
import './styles/tailwind.css'
import NotificationsPage from './routes/NotificationsPage'
import SettingsNotificationsPage from './routes/SettingsNotificationsPage'

function TopBar() {
	const { theme, setTheme } = useUi()
	return (
		<div data-topbar="true" className="sticky top-0 z-50 border-b border-[rgb(var(--border))]/70 backdrop-blur supports-[backdrop-filter]:bg-[rgb(var(--bg-canvas))]/70">
			<div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="h-6 w-6 rounded-md bg-brand-500" aria-hidden />
					<h1 className="text-base font-semibold">Notifications</h1>
				</div>
				<div className="flex items-center gap-2">
					<button className="ui-btn" aria-label="Settings"><Settings className="h-4 w-4" /></button>
					<button className="ui-iconbtn" aria-label="Toggle theme" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
						{theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
					</button>
				</div>
			</div>
		</div>
	)
}

function Shell() {
	const containerRef = useRef<HTMLDivElement>(null)
	return (
		<div ref={containerRef} className="min-h-screen kd-bg">
			<TopBar />
			<main className="mx-auto max-w-7xl px-4 py-6">
				<Routes>
					<Route path="/notifications" element={<NotificationsPage containerRef={containerRef} />} />
					<Route path="/settings/notifications" element={<SettingsNotificationsPage />} />
					<Route path="*" element={<NotificationsPage containerRef={containerRef} />} />
				</Routes>
			</main>
		</div>
	)
}

export default function App() {
	return (
		<BrowserRouter>
			<Shell />
		</BrowserRouter>
	)
}
