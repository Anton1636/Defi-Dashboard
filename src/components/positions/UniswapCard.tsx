import type { UniswapPosition } from '@/types'

function formatUSD(v: number) {
	if (v >= 1000) return `$${(v / 1000).toFixed(2)}K`
	return `$${v.toFixed(2)}`
}

export function UniswapCard({ position }: { position: UniswapPosition }) {
	return (
		<div
			style={{
				background: 'var(--gradient-card)',
				border: '1px solid var(--border-primary)',
				borderRadius: '16px',
				padding: '20px',
				transition: 'border-color 0.2s',
			}}
			onMouseEnter={e => {
				e.currentTarget.style.borderColor = 'var(--uniswap)44'
			}}
			onMouseLeave={e => {
				e.currentTarget.style.borderColor = 'var(--border-primary)'
			}}
		>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: '16px',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
					<div
						style={{
							width: '40px',
							height: '40px',
							borderRadius: '50%',
							background: 'var(--uniswap-glow)',
							border: '1px solid var(--uniswap)44',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '20px',
						}}
					>
						🦄
					</div>
					<div>
						<p
							style={{
								fontWeight: 600,
								color: 'var(--text-primary)',
								fontSize: '14px',
							}}
						>
							{position.token0.symbol}/{position.token1.symbol}
						</p>
						<p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
							Uniswap V3 · Ethereum
						</p>
					</div>
				</div>

				<span
					style={{
						fontSize: '12px',
						fontWeight: 500,
						padding: '4px 10px',
						borderRadius: '20px',
						background: position.inRange
							? 'var(--accent-green-glow)'
							: 'rgba(245, 158, 11, 0.1)',
						color: position.inRange
							? 'var(--accent-green)'
							: 'var(--accent-amber)',
						border: `1px solid ${position.inRange ? 'var(--accent-green)44' : 'var(--accent-amber)44'}`,
					}}
				>
					{position.inRange ? '● In range' : '○ Out of range'}
				</span>
			</div>

			{/* Stats */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: '8px',
					marginBottom: '12px',
				}}
			>
				{[
					{
						label: 'Position value',
						value: formatUSD(position.valueUSD),
						color: 'var(--text-primary)',
					},
					{
						label: 'Fees earned',
						value: formatUSD(position.feesEarned),
						color: 'var(--accent-green)',
					},
					{
						label: 'Pool ID',
						value: position.poolId.slice(0, 8) + '...',
						color: 'var(--text-tertiary)',
					},
				].map(stat => (
					<div
						key={stat.label}
						style={{
							background: 'var(--bg-elevated)',
							borderRadius: '10px',
							padding: '10px 12px',
						}}
					>
						<p
							style={{
								fontSize: '11px',
								color: 'var(--text-tertiary)',
								marginBottom: '4px',
							}}
						>
							{stat.label}
						</p>
						<p
							style={{
								fontSize: '13px',
								fontWeight: 600,
								color: stat.color,
								fontFamily: stat.label === 'Pool ID' ? 'monospace' : 'inherit',
							}}
						>
							{stat.value}
						</p>
					</div>
				))}
			</div>

			{/* Tokens */}
			<div style={{ display: 'flex', gap: '8px' }}>
				{[position.token0, position.token1].map((token, i) => (
					<div
						key={i}
						style={{
							flex: 1,
							background: 'var(--bg-elevated)',
							borderRadius: '8px',
							padding: '8px 12px',
							fontSize: '12px',
						}}
					>
						<span style={{ color: 'var(--text-tertiary)' }}>Token {i}: </span>
						<span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
							{token.symbol}
						</span>
						<span style={{ color: 'var(--text-tertiary)', marginLeft: '6px' }}>
							${token.priceUSD.toFixed(2)}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}
