import React, { useEffect, useState } from 'react'
import { Popover } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { useFilters } from '../store/useFilters'
import { mockApi } from '../api/mockAdapter'

interface Workflow { id: string; name: string; count?: number }

export default function WorkflowFilter({ className }: { className?: string }) {
	const workflowIds = useFilters((s) => s.workflowIds as Set<string>)
	const toggleWorkflow = useFilters((s) => s.toggleWorkflow as (id: string) => void)
	const clearWorkflows = useFilters((s) => s.clearWorkflows as () => void)

	const [items, setItems] = useState<Workflow[]>([])
	useEffect(() => {
		let cancelled = false
		;(async () => {
			try {
				const ws = await mockApi.listWorkflows()
				if (!cancelled) setItems(ws)
			} catch {}
		})()
		return () => { cancelled = true }
	}, [])

	const selectedCount = workflowIds ? workflowIds.size : 0

	return (
		<Popover className={clsx('relative', className)}>
			<Popover.Button className="ui-btn h-10">
				<span className="mr-1">Workflows</span>
				{selectedCount > 0 && (
					<span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs text-[var(--brand-ink)]">
						{selectedCount}
					</span>
				)}
				<ChevronDown className="ml-1 h-4 w-4 opacity-70" aria-hidden />
			</Popover.Button>

			<Popover.Panel className="absolute z-40 mt-2 w-72 rounded-xl border border-[var(--border)] bg-[var(--surface-0)] p-2 shadow-elev-2 focus:outline-none">
				<div className="mb-2 flex items-center justify-between px-1">
					<span className="text-xs font-semibold text-[var(--muted)]">Select workflows</span>
					{selectedCount > 0 && (
						<button className="text-xs underline opacity-80 hover:opacity-100" onClick={clearWorkflows}>
							Clear
						</button>
					)}
				</div>
				<ul className="max-h-64 overflow-auto pr-1">
					{items.map((w) => {
						const checked = workflowIds?.has(w.id)
						return (
							<li key={w.id}>
								<label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 hover:bg-[var(--surface-1)]">
									<span className="flex items-center gap-2">
										<input
											type="checkbox"
											className="h-4 w-4"
											checked={!!checked}
											onChange={() => toggleWorkflow(w.id)}
											aria-label={`Toggle workflow ${w.name}`}
										/>
										<span className="text-sm">{w.name}</span>
									</span>
									<span className="text-xs text-[var(--muted)]">{w.count ?? 0}</span>
								</label>
							</li>
						)
					})}
					{items.length === 0 && (
						<li className="px-2 py-6 text-center text-sm text-[var(--muted)]">No workflows</li>
					)}
				</ul>
			</Popover.Panel>
		</Popover>
	)
} 