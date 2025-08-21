import React from 'react'

export default function Pagination({ page, pageSize, total, onPageChange }: { page: number; pageSize: number; total: number; onPageChange: (p: number) => void }) {
	const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)))
	const canPrev = page > 1
	const canNext = page < totalPages

	const makeRange = () => {
		const maxShown = 7
		const pages: number[] = []
		let start = Math.max(1, page - 3)
		let end = Math.min(totalPages, start + maxShown - 1)
		start = Math.max(1, Math.min(start, end - maxShown + 1))
		for (let p = start; p <= end; p++) pages.push(p)
		return pages
	}

	if (totalPages <= 1) return null

	return (
		<nav className="flex items-center justify-between" aria-label="Pagination">
			<div className="flex items-center gap-2">
				<button className="ui-btn" onClick={() => onPageChange(page - 1)} disabled={!canPrev} aria-label="Previous page">Prev</button>
				<ul className="flex items-center gap-1">
					{makeRange().map((p) => (
						<li key={p}>
							<button
								className={`ui-btn ${p === page ? 'ui-btn--primary' : ''}`}
								onClick={() => onPageChange(p)}
								aria-current={p === page ? 'page' : undefined}
							>
								{p}
							</button>
						</li>
					))}
				</ul>
				<button className="ui-btn" onClick={() => onPageChange(page + 1)} disabled={!canNext} aria-label="Next page">Next</button>
			</div>
			<div className="text-sm text-[rgb(var(--text-muted))]">Page {page} of {totalPages}</div>
		</nav>
	)
} 