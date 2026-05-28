import type {
	DeFiPosition,
	UniswapPosition,
	AavePosition,
	CompoundPosition,
} from '@/types'

function formatUSD(value: number): string {
	if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
	if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`
	return `$${value.toFixed(2)}`
}

const PROTOCOL_CONFIG: Record<
	string,
	{ icon: string; color: string; bg: string }
> = {
	uniswap: { icon: '🦄', color: 'var(--uniswap)', bg: 'var(--uniswap-glow)' },
	aave: { icon: '👻', color: 'var(--aave)', bg: 'var(--aave-glow)' },
	compound: {
		icon: '🏦',
		color: 'var(--compound)',
		bg: 'var(--compound-glow)',
	},
}

function UniswapDetails({ pos }: { pos: UniswapPosition }) {
	return (
		<div style={{ textAlign: 'right' }}>
			<p
				style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}
			>
				{pos.token0.symbol}/{pos.token1.symbol}
			</p>
			<p
				style={{
					fontSize: 11,
					color: pos.inRange ? 'var(--accent-green)' : 'var(--accent-amber)',
					fontWeight: 600,
					marginTop: 1,
				}}
			>
				{pos.inRange ? '● In range' : '○ Out of range'}
			</p>
		</div>
	)
}

function AaveDetails({ pos }: { pos: AavePosition }) {
	const color =
		pos.healthFactor > 2
			? 'var(--accent-green)'
			: pos.healthFactor > 1.5
				? 'var(--accent-amber)'
				: 'var(--accent-red)'
	return (
		<div style={{ textAlign: 'right' }}>
			<p
				style={{
					fontSize: 13,
					fontWeight: 700,
					color,
					fontVariantNumeric: 'tabular-nums',
				}}
			>
				HF: {pos.healthFactor.toFixed(2)}
			</p>
			<p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>
				{pos.netAPY.toFixed(2)}% APY
			</p>
		</div>
	)
}

function CompoundDetails({ pos }: { pos: CompoundPosition }) {
	return (
		<div style={{ textAlign: 'right' }}>
			<p style={{ fontSize: 13, fontWeight: 600, color: 'var(--compound)' }}>
				{pos.supplyAPR.toFixed(2)}% APR
			</p>
			<p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>
				{pos.market}
			</p>
		</div>
	)
}

export function PositionRow({ position }: { position: DeFiPosition }) {
	const cfg = PROTOCOL_CONFIG[position.protocol]

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '10px 0',
				borderBottom: '1px solid var(--border-primary)',
				transition: 'all 0.15s',
				cursor: 'default',
			}}
			onMouseEnter={e => {
				e.currentTarget.style.background = 'var(--bg-elevated)'
				e.currentTarget.style.margin = '0 -20px'
				e.currentTarget.style.padding = '10px 20px'
				e.currentTarget.style.borderRadius = '8px'
			}}
			onMouseLeave={e => {
				e.currentTarget.style.background = 'transparent'
				e.currentTarget.style.margin = '0'
				e.currentTarget.style.padding = '10px 0'
				e.currentTarget.style.borderRadius = '0'
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
				<div
					style={{
						width: 34,
						height: 34,
						borderRadius: 10,
						background: cfg?.bg,
						border: `1px solid ${cfg?.color}33`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 16,
						flexShrink: 0,
					}}
				>
					{cfg?.icon}
				</div>
				<div>
					<p
						style={{
							fontSize: 13,
							fontWeight: 600,
							color: 'var(--text-primary)',
						}}
					>
						{position.protocol.charAt(0).toUpperCase() +
							position.protocol.slice(1)}
					</p>
					<p
						style={{
							fontSize: 12,
							color: 'var(--text-secondary)',
							fontWeight: 700,
							marginTop: 1,
							fontVariantNumeric: 'tabular-nums',
						}}
					>
						{formatUSD(position.valueUSD)}
					</p>
				</div>
			</div>

			{position.protocol === 'uniswap' && (
				<UniswapDetails pos={position as UniswapPosition} />
			)}
			{position.protocol === 'aave' && (
				<AaveDetails pos={position as AavePosition} />
			)}
			{position.protocol === 'compound' && (
				<CompoundDetails pos={position as CompoundPosition} />
			)}
		</div>
	)
}
