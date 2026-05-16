import { getChainConfig } from '@/lib/chains'

interface ChainBadgeProps {
	chainId: number
	size?: 'sm' | 'md'
}

// Displays a badge with the chain's icon and short name, styled according to the chain's color scheme.s
export function ChainBadge({ chainId, size = 'sm' }: ChainBadgeProps) {
	const chain = getChainConfig(chainId)

	const padding = size === 'sm' ? '2px 8px' : '4px 10px'
	const fontSize = size === 'sm' ? '11px' : '12px'

	return (
		<span
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: '4px',
				padding,
				borderRadius: '20px',
				fontSize,
				fontWeight: 500,
				background: chain.glow,
				color: chain.color,
				border: `1px solid ${chain.color}33`,
			}}
		>
			<span>{chain.icon}</span>
			{chain.shortName}
		</span>
	)
}
