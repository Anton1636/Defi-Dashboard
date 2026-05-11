import type {
	DeFiPosition,
	UniswapPosition,
	AavePosition,
	CompoundPosition,
} from '@/types'
import { ProtocolBadge } from '@/components/ui/Badge'

function formatUSD(value: number): string {
	if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
	if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`
	return `$${value.toFixed(2)}`
}

// ─── Protocol-specific details ────────────────────────────────────────────────

function UniswapDetails({ position }: { position: UniswapPosition }) {
	return (
		<div className='text-right'>
			<p className='text-sm font-medium text-gray-900'>
				{position.token0.symbol}/{position.token1.symbol}
			</p>
			<p
				className={`text-xs ${position.inRange ? 'text-green-600' : 'text-amber-500'}`}
			>
				{position.inRange ? '● In range' : '○ Out of range'}
			</p>
		</div>
	)
}

function AaveDetails({ position }: { position: AavePosition }) {
	// Health factor < 1.5 — danger liquidation risk
	const hfColor =
		position.healthFactor > 2
			? 'text-green-600'
			: position.healthFactor > 1.5
				? 'text-amber-500'
				: 'text-red-500'

	return (
		<div className='text-right'>
			<p className={`text-xs font-medium ${hfColor}`}>
				HF: {position.healthFactor.toFixed(2)}
			</p>
			<p className='text-xs text-gray-400'>{position.netAPY.toFixed(2)}% APY</p>
		</div>
	)
}

function CompoundDetails({ position }: { position: CompoundPosition }) {
	return (
		<div className='text-right'>
			<p className='text-xs text-gray-600'>{position.market}</p>
			<p className='text-xs text-green-600'>
				{position.supplyAPR.toFixed(2)}% APR
			</p>
		</div>
	)
}

// ─── Main component ──────────────────────────────────────────────────────────

interface PositionRowProps {
	position: DeFiPosition
}

export function PositionRow({ position }: PositionRowProps) {
	const PROTOCOL_ICONS: Record<string, string> = {
		uniswap: '🦄',
		aave: '👻',
		compound: '🏦',
	}

	return (
		<div className='flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 -mx-5 px-5 transition-colors'>
			<div className='flex items-center gap-3'>
				<div className='w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-lg'>
					{PROTOCOL_ICONS[position.protocol] ?? '💠'}
				</div>
				<div>
					<div className='flex items-center gap-2 mb-0.5'>
						<ProtocolBadge protocol={position.protocol} />
					</div>
					<p className='text-sm font-semibold text-gray-900'>
						{formatUSD(position.valueUSD)}
					</p>
				</div>
			</div>

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
