import { useRef } from 'react'
import { BrowserRouter, Navigate, Route, Routes, Link } from 'react-router-dom'
import './styles/tailwind.css'
import NotificationsPage from './routes/NotificationsPage'

function TopBar() {
	return (
		<div data-topbar="true" className="sticky top-0 z-50 border-b border-[rgb(var(--border))]/70 backdrop-blur bg-[rgb(var(--bg-canvas))]/80">
			<div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="h-6 w-6 rounded-md bg-brand-500" aria-hidden />
					<h1 className="text-base font-semibold"><Link to="/notifications" aria-label="Go to notifications" className="hover:underline">Notifications</Link></h1>
				</div>
				<div className="flex items-center gap-2">
					{/* settings/theme removed */}
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
					<Route path="/" element={<Navigate to="/notifications" replace />} />
					<Route path="/notifications" element={<NotificationsPage containerRef={containerRef} />} />
					<Route path="*" element={<Navigate to="/notifications" replace />} />
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
