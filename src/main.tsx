import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { applySkinToDocument, getInitialSkin, getInitialTheme } from './theme/skins'
import { ErrorBoundary } from './shared/ErrorBoundary'
import './styles/tailwind.css'

// Global error hooks for visibility during dev
window.addEventListener('error', (e) => console.error('window.onerror', (e as any).error || e))
window.addEventListener('unhandledrejection', (e) => console.error('unhandledrejection', (e as any).reason))

applySkinToDocument(getInitialSkin(), getInitialTheme())

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ErrorBoundary>
			<App />
		</ErrorBoundary>
	</StrictMode>,
)
