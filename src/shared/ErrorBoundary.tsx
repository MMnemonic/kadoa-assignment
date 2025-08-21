import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { err?: Error }

export class ErrorBoundary extends Component<Props, State> {
	state: State = {}
	static getDerivedStateFromError(err: Error) { return { err } }
	componentDidCatch(err: Error, info: any) {
		// Also log to console for Vite overlay
		console.error('ErrorBoundary caught', err, info)
	}
	render() {
		if (!this.state.err) return this.props.children
		return (
			<div className="p-6 text-sm">
				<h1 className="text-red-400 font-semibold mb-2">App crashed</h1>
				<pre className="text-red-300 whitespace-pre-wrap">{String(this.state.err.stack || this.state.err.message)}</pre>
				<button className="ui-btn ui-btn--primary mt-4" onClick={() => { this.setState({ err: undefined }); location.reload() }}>
					Reload
				</button>
			</div>
		)
	}
} 