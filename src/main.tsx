import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './shared/ErrorBoundary'
import './styles/tailwind.css'

// Global error hooks for visibility during dev
window.addEventListener('error', (e: ErrorEvent) => console.error('window.onerror', e.error || e))
window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => console.error('unhandledrejection', e.reason))

// Force dark theme by default
if (typeof document !== 'undefined') {
	document.documentElement.classList.add('dark')
	document.documentElement.setAttribute('data-theme', 'dark')
	document.documentElement.setAttribute('data-skin', 'kadoa')
	document.body.setAttribute('data-skin', 'kadoa')
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ErrorBoundary>
			<App />
		</ErrorBoundary>
	</StrictMode>,
)
