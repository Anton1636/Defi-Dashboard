'use client'

type Protocol = 'all' | 'uniswap' | 'aave' | 'compound'

interface ProtocolFilterProps {
	active: Protocol
	counts: Record<string, number>
	onChange: (protocol: Protocol) => void
}

const FILTERS: { value: Protocol; label: string; color: string }[] = [
	{ value: 'all', label: 'All', color: 'bg-gray-100 text-gray-700' },
	{ value: 'uniswap', label: 'Uniswap', color: 'bg-purple-50 text-purple-700' },
	{ value: 'aave', label: 'Aave', color: 'bg-blue-50 text-blue-700' },
	{ value: 'compound', label: 'Compound', color: 'bg-green-50 text-green-700' },
]

export function ProtocolFilter({
	active,
	counts,
	onChange,
}: ProtocolFilterProps) {
	return (
		<div className='flex gap-2 flex-wrap'>
			{FILTERS.map(filter => {
				const count =
					filter.value === 'all'
						? Object.values(counts).reduce((a, b) => a + b, 0)
						: (counts[filter.value] ?? 0)

				const isActive = active === filter.value

				return (
					<button
						key={filter.value}
						onClick={() => onChange(filter.value)}
						className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
							isActive
								? filter.color + ' ring-1 ring-current ring-opacity-30'
								: 'bg-white text-gray-500 border border-gray-100 hover:border-gray-200'
						}`}
					>
						{filter.label}
						{/* Position count */}
						<span
							className={`text-xs px-1.5 py-0.5 rounded-full ${
								isActive ? 'bg-white bg-opacity-60' : 'bg-gray-50'
							}`}
						>
							{count}
						</span>
					</button>
				)
			})}
		</div>
	)
}
