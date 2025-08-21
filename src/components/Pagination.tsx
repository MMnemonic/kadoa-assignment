export default function Pagination({ page, pageSize, total, onPageChange }: { page: number; pageSize: number; total: number; onPageChange: (p: number) => void }) {
	const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)))
	const canPrev = page > 1
	const canNext = page < totalPages

	const pages = Array.from({ length: Math.min(4, totalPages) }, (_, i) => i + 1)

	if (totalPages <= 1) return null

	return (
		<nav className="flex items-center justify-between w-full" aria-label="Pagination">
			<div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
				<button className="ui-btn" onClick={() => onPageChange(page - 1)} disabled={!canPrev} aria-label="Previous page">Prev</button>
				<ul className="flex items-center gap-1">
					{pages.map((p) => (
						<li key={p}>
							<button
								className={`ui-btn ${p === page ? 'ring-1 ring-[rgb(var(--accent))]' : ''}`}
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
			<div className="text-sm text-[rgb(var(--text-muted))] hidden sm:block">Page {page} of {totalPages}</div>
		</nav>
	)
} 