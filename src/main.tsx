import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { applySkinToDocument, getInitialSkin, getInitialTheme } from './theme/skins'

applySkinToDocument(getInitialSkin(), getInitialTheme())

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>,
)
