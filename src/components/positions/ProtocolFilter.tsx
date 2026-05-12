'use client'

type Protocol = 'all' | 'uniswap' | 'aave' | 'compound'

interface ProtocolFilterProps {
	active: Protocol
	counts: Record<string, number>
	onChange: (protocol: Protocol) => void
}

const FILTERS: {
	value: Protocol
	label: string
	activeColor: string
	activeBg: string
}[] = [
	{
		value: 'all',
		label: 'All',
		activeColor: 'var(--text-primary)',
		activeBg: 'var(--bg-elevated)',
	},
	{
		value: 'uniswap',
		label: 'Uniswap',
		activeColor: 'var(--uniswap)',
		activeBg: 'var(--uniswap-glow)',
	},
	{
		value: 'aave',
		label: 'Aave',
		activeColor: 'var(--aave)',
		activeBg: 'var(--aave-glow)',
	},
	{
		value: 'compound',
		label: 'Compound',
		activeColor: 'var(--compound)',
		activeBg: 'var(--compound-glow)',
	},
]

export function ProtocolFilter({
	active,
	counts,
	onChange,
}: ProtocolFilterProps) {
	const totalCount = Object.values(counts).reduce((a, b) => a + b, 0)

	return (
		<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
			{FILTERS.map(filter => {
				const count =
					filter.value === 'all' ? totalCount : (counts[filter.value] ?? 0)
				const isActive = active === filter.value

				return (
					<button
						key={filter.value}
						onClick={() => onChange(filter.value)}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '6px',
							padding: '6px 12px',
							borderRadius: '8px',
							fontSize: '13px',
							fontWeight: isActive ? 500 : 400,
							color: isActive ? filter.activeColor : 'var(--text-secondary)',
							background: isActive ? filter.activeBg : 'transparent',
							border: `1px solid ${isActive ? filter.activeColor + '44' : 'var(--border-primary)'}`,
							cursor: 'pointer',
							transition: 'all 0.15s',
						}}
					>
						{filter.label}
						<span
							style={{
								fontSize: '11px',
								padding: '1px 6px',
								borderRadius: '20px',
								background: isActive
									? filter.activeColor + '22'
									: 'var(--bg-elevated)',
								color: isActive ? filter.activeColor : 'var(--text-tertiary)',
							}}
						>
							{count}
						</span>
					</button>
				)
			})}
		</div>
	)
}
