import type { UniswapPosition } from '@/types'

function fmt(v: number) {
	if (v >= 1000) return `$${(v / 1000).toFixed(2)}K`
	return `$${v.toFixed(2)}`
}

export function UniswapCard({ position }: { position: UniswapPosition }) {
	return (
		<div
			style={{
				background: 'var(--card-bg)',
				border: '1px solid var(--card-border)',
				borderRadius: 'var(--card-radius)',
				padding: 'var(--card-padding-lg)',
				position: 'relative',
				overflow: 'hidden',
				transition: 'border-color .2s, box-shadow .2s, transform .15s',
				boxShadow: 'var(--shadow-card)',
			}}
			onMouseEnter={e => {
				e.currentTarget.style.borderColor = 'rgba(255,0,122,.3)'
				e.currentTarget.style.boxShadow = 'var(--shadow-hover)'
				e.currentTarget.style.transform = 'translateY(-2px)'
			}}
			onMouseLeave={e => {
				e.currentTarget.style.borderColor = 'var(--card-border)'
				e.currentTarget.style.boxShadow = 'var(--shadow-card)'
				e.currentTarget.style.transform = 'translateY(0)'
			}}
		>
			{/* Uniswap accent line */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 2,
					background:
						'linear-gradient(90deg,#ff007a,rgba(255,0,122,.15),transparent)',
				}}
			/>

			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 16,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<div
						style={{
							width: 40,
							height: 40,
							borderRadius: '50%',
							background: 'var(--uniswap-glow)',
							border: '1px solid rgba(255,0,122,.25)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 20,
						}}
					>
						🦄
					</div>
					<div>
						<p
							style={{
								fontSize: 14,
								fontWeight: 800,
								color: 'var(--text-primary)',
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
						borderRadius: 20,
						background: position.inRange
							? 'var(--accent-green-glow)'
							: 'rgba(251,191,36,.1)',
						color: position.inRange
							? 'var(--accent-green)'
							: 'var(--accent-amber)',
						border: `1px solid ${position.inRange ? 'rgba(74,222,128,.25)' : 'rgba(251,191,36,.25)'}`,
					}}
				>
					{position.inRange ? '● In range' : '○ Out of range'}
				</span>
			</div>

			{/* Stats */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3,1fr)',
					gap: 8,
					marginBottom: 12,
				}}
			>
				{[
					{
						label: 'Position value',
						value: fmt(position.valueUSD),
						color: 'var(--text-primary)',
					},
					{
						label: 'Fees earned',
						value: fmt(position.feesEarned),
						color: 'var(--accent-green)',
					},
					{
						label: 'Pool ID',
						value: position.poolId.slice(0, 8) + '…',
						color: 'var(--text-tertiary)',
						mono: true,
					},
				].map(s => (
					<div
						key={s.label}
						style={{
							background: 'var(--surface-2)',
							borderRadius: 'var(--card-radius-sm)',
							padding: '10px 12px',
						}}
					>
						<p
							style={{
								fontSize: 9,
								color: 'var(--text-tertiary)',
								fontWeight: 700,
								textTransform: 'uppercase',
								letterSpacing: '.07em',
								marginBottom: 5,
							}}
						>
							{s.label}
						</p>
						<p
							style={{
								fontSize: 13,
								fontWeight: 700,
								color: s.color,
								fontFamily: s.mono ? 'monospace' : 'inherit',
							}}
						>
							{s.value}
						</p>
					</div>
				))}
			</div>

			{/* Token rows */}
			<div style={{ display: 'flex', gap: 8 }}>
				{[position.token0, position.token1].map((token, i) => (
					<div
						key={i}
						style={{
							flex: 1,
							background: 'var(--surface-2)',
							borderRadius: 'var(--card-radius-xs)',
							padding: '8px 12px',
							display: 'flex',
							alignItems: 'center',
							gap: 8,
						}}
					>
						<div
							style={{
								fontSize: 11,
								color: 'var(--text-tertiary)',
								fontWeight: 600,
							}}
						>
							Token {i}:
						</div>
						<div
							style={{
								fontSize: 12,
								fontWeight: 700,
								color: 'var(--text-primary)',
							}}
						>
							{token.symbol}
						</div>
						<div
							style={{
								fontSize: 11,
								color: 'var(--accent-blue)',
								marginLeft: 'auto',
								fontWeight: 600,
							}}
						>
							${token.priceUSD.toFixed(2)}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
