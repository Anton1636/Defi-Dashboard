import { Sparkline, generateSparkData } from '@/components/ui/Sparkline'
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

const PROTOCOL_STYLES: Record<
	string,
	{ color: string; glow: string; icon: string }
> = {
	uniswap: { color: 'var(--uniswap)', glow: 'var(--uniswap-glow)', icon: '🦄' },
	aave: { color: 'var(--aave)', glow: 'var(--aave-glow)', icon: '👻' },
	compound: {
		color: 'var(--compound)',
		glow: 'var(--compound-glow)',
		icon: '🏦',
	},
}

function UniswapDetails({ position }: { position: UniswapPosition }) {
	return (
		<div style={{ textAlign: 'right' }}>
			<p
				style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}
			>
				{position.token0.symbol}/{position.token1.symbol}
			</p>
			<p
				style={{
					fontSize: 11,
					color: position.inRange
						? 'var(--accent-green)'
						: 'var(--accent-amber)',
				}}
			>
				{position.inRange ? '● In range' : '○ Out of range'}
			</p>
		</div>
	)
}

function AaveDetails({ position }: { position: AavePosition }) {
	const hfColor =
		position.healthFactor > 2
			? 'var(--accent-green)'
			: position.healthFactor > 1.5
				? 'var(--accent-amber)'
				: 'var(--accent-red)'

	return (
		<div style={{ textAlign: 'right' }}>
			<p style={{ fontSize: 12, fontWeight: 600, color: hfColor }}>
				HF: {position.healthFactor.toFixed(2)}
			</p>
			<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
				{position.netAPY.toFixed(2)}% APY
			</p>
		</div>
	)
}

function CompoundDetails({ position }: { position: CompoundPosition }) {
	return (
		<div style={{ textAlign: 'right' }}>
			<p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
				{position.market}
			</p>
			<p style={{ fontSize: 11, color: 'var(--accent-green)' }}>
				{position.supplyAPR.toFixed(2)}% APR
			</p>
		</div>
	)
}

interface PositionRowProps {
	position: DeFiPosition
	index?: number
}

export function PositionRow({ position, index = 0 }: PositionRowProps) {
	const style = PROTOCOL_STYLES[position.protocol]
	const sparkData = generateSparkData(`${position.id}-7d`, 7)

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '12px 0',
				borderBottom: '1px solid var(--border-primary)',
				transition: 'background 0.15s, padding 0.15s, margin 0.15s',
				cursor: 'default',
				gap: 12,
				animationDelay: `${index * 0.06}s`,
			}}
			className='slide-in'
			onMouseEnter={e => {
				e.currentTarget.style.background = 'var(--bg-elevated)'
				e.currentTarget.style.margin = '0 -20px'
				e.currentTarget.style.padding = '12px 20px'
				e.currentTarget.style.borderRadius = '10px'
			}}
			onMouseLeave={e => {
				e.currentTarget.style.background = 'transparent'
				e.currentTarget.style.margin = '0'
				e.currentTarget.style.padding = '12px 0'
				e.currentTarget.style.borderRadius = '0'
			}}
		>
			{/* Left — protocol icon + name + value */}
			<div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
				<div
					style={{
						width: 36,
						height: 36,
						borderRadius: '50%',
						background: `${style?.color}22`,
						border: `1px solid ${style?.color}44`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 16,
						flexShrink: 0,
					}}
				>
					{style?.icon}
				</div>
				<div>
					<p
						style={{
							fontSize: 13,
							fontWeight: 500,
							color: 'var(--text-primary)',
						}}
					>
						{position.protocol.charAt(0).toUpperCase() +
							position.protocol.slice(1)}
					</p>
					<p
						style={{
							fontSize: 13,
							fontWeight: 600,
							color: 'var(--text-primary)',
						}}
					>
						{formatUSD(position.valueUSD)}
					</p>
				</div>
			</div>

			{/* Center — sparkline */}
			<div style={{ flexShrink: 0 }}>
				<Sparkline data={sparkData} width={64} height={24} />
			</div>

			{/* Right — protocol details */}
			{position.protocol === 'uniswap' && (
				<UniswapDetails position={position as UniswapPosition} />
			)}
			{position.protocol === 'aave' && (
				<AaveDetails position={position as AavePosition} />
			)}
			{position.protocol === 'compound' && (
				<CompoundDetails position={position as CompoundPosition} />
			)}
		</div>
	)
}
