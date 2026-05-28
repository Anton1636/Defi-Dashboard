import type { UniswapPosition } from '@/types'

function formatUSD(v: number) {
	if (v >= 1000) return `$${(v / 1000).toFixed(2)}K`
	return `$${v.toFixed(2)}`
}

export function UniswapCard({ position }: { position: UniswapPosition }) {
	return (
		<div
			style={{
				background: 'var(--bg-card)',
				border: '1px solid var(--border-primary)',
				borderRadius: 14,
				padding: 18,
				transition: 'border-color 0.2s',
			}}
			onMouseEnter={e => {
				e.currentTarget.style.borderColor = 'rgba(255,0,122,0.3)'
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
					marginBottom: 14,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
					<div
						style={{
							width: 38,
							height: 38,
							borderRadius: 10,
							background: 'var(--uniswap-glow)',
							border: '1px solid rgba(255,0,122,0.2)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 18,
						}}
					>
						🦄
					</div>
					<div>
						<p
							style={{
								fontWeight: 700,
								color: 'var(--text-primary)',
								fontSize: 14,
							}}
						>
							{position.token0.symbol}/{position.token1.symbol}
						</p>
						<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
							Uniswap V3 · Ethereum
						</p>
					</div>
				</div>
				<span
					style={{
						fontSize: 11,
						fontWeight: 700,
						padding: '4px 10px',
						borderRadius: 8,
						background: position.inRange
							? 'var(--accent-green-glow)'
							: 'rgba(255,214,10,0.1)',
						color: position.inRange
							? 'var(--accent-green)'
							: 'var(--accent-amber)',
						border: `1px solid ${position.inRange ? 'rgba(48,209,88,0.2)' : 'rgba(255,214,10,0.2)'}`,
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
					gap: 6,
					marginBottom: 10,
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
						value: position.poolId.slice(0, 8) + '…',
						color: 'var(--text-tertiary)',
					},
				].map(s => (
					<div
						key={s.label}
						style={{
							background: 'var(--bg-elevated)',
							borderRadius: 8,
							padding: '9px 10px',
						}}
					>
						<p
							style={{
								fontSize: 10,
								color: 'var(--text-tertiary)',
								marginBottom: 3,
								fontWeight: 600,
								textTransform: 'uppercase',
								letterSpacing: '0.06em',
							}}
						>
							{s.label}
						</p>
						<p
							style={{
								fontSize: 13,
								fontWeight: 700,
								color: s.color,
								fontFamily: s.label === 'Pool ID' ? 'monospace' : 'inherit',
							}}
						>
							{s.value}
						</p>
					</div>
				))}
			</div>

			{/* Tokens */}
			<div style={{ display: 'flex', gap: 6 }}>
				{[position.token0, position.token1].map((token, i) => (
					<div
						key={i}
						style={{
							flex: 1,
							background: 'var(--bg-elevated)',
							borderRadius: 8,
							padding: '8px 10px',
							fontSize: 12,
						}}
					>
						<span style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>
							Token {i}:{' '}
						</span>
						<span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
							{token.symbol}
						</span>
						<span
							style={{
								color: 'var(--accent-blue)',
								marginLeft: 6,
								fontWeight: 600,
							}}
						>
							${token.priceUSD.toFixed(2)}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}
