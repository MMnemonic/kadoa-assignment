class ResizeObserverPolyfill {
	observe() {}
	unobserve() {}
	disconnect() {}
}
;(globalThis as any).ResizeObserver = ResizeObserverPolyfill 