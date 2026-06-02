import type { UniswapPosition } from '@/types'

function formatUSD(v: number) {
	if (v >= 1000) return `$${(v / 1000).toFixed(2)}K`
	return `$${v.toFixed(2)}`
}

const COIN_ICONS: Record<string, { bg: string; color: string; char: string }> =
	{
		ETH: { bg: 'rgba(98,126,234,0.2)', color: '#627eea', char: 'Ξ' },
		USDC: { bg: 'rgba(39,117,202,0.2)', color: '#2775ca', char: '$' },
		USDT: { bg: 'rgba(38,161,123,0.2)', color: '#26a17b', char: '₮' },
		WBTC: { bg: 'rgba(247,147,26,0.2)', color: '#f7931a', char: '₿' },
		DAI: { bg: 'rgba(249,176,28,0.2)', color: '#f9b01c', char: '◈' },
	}

function CoinIcon({ symbol }: { symbol: string }) {
	const cfg = COIN_ICONS[symbol] ?? {
		bg: 'rgba(255,255,255,0.1)',
		color: 'rgba(255,255,255,0.5)',
		char: symbol.slice(0, 1),
	}
	return (
		<div
			style={{
				width: 28,
				height: 28,
				borderRadius: '50%',
				background: cfg.bg,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontSize: 12,
				fontWeight: 800,
				color: cfg.color,
				flexShrink: 0,
			}}
		>
			{cfg.char}
		</div>
	)
}

export function UniswapCard({ position }: { position: UniswapPosition }) {
	return (
		<div
			style={{
				background: 'rgba(255,255,255,0.02)',
				border: '1px solid rgba(255,255,255,0.07)',
				borderRadius: 16,
				padding: 20,
				position: 'relative',
				overflow: 'hidden',
				transition: 'all 0.2s',
			}}
			onMouseEnter={e => {
				e.currentTarget.style.borderColor = 'rgba(255,0,122,0.25)'
				e.currentTarget.style.transform = 'translateY(-2px)'
				e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.5)'
			}}
			onMouseLeave={e => {
				e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
				e.currentTarget.style.transform = 'translateY(0)'
				e.currentTarget.style.boxShadow = 'none'
			}}
		>
			{/* Top colored line */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 2,
					background:
						'linear-gradient(90deg,#ff007a,rgba(255,0,122,0.1),transparent)',
				}}
			/>

			{/* Decorative background orb */}
			<div
				style={{
					position: 'absolute',
					top: -20,
					right: -20,
					width: 180,
					height: 180,
					borderRadius: '50%',
					background:
						'radial-gradient(circle,rgba(255,0,122,0.08) 0%,transparent 70%)',
					pointerEvents: 'none',
				}}
			/>

			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 16,
					position: 'relative',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<div
						style={{
							width: 44,
							height: 44,
							borderRadius: '50%',
							background: 'rgba(255,0,122,0.12)',
							border: '1px solid rgba(255,0,122,0.25)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 22,
						}}
					>
						🦄
					</div>
					<div>
						<p
							style={{
								fontSize: 15,
								fontWeight: 800,
								color: 'var(--text-primary)',
								letterSpacing: '-0.3px',
							}}
						>
							UNISWAP V3
						</p>
						<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
							Ethereum
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
							? 'rgba(74,222,128,0.1)'
							: 'rgba(251,191,36,0.1)',
						color: position.inRange
							? 'var(--accent-green)'
							: 'var(--accent-amber)',
						border: `1px solid ${position.inRange ? 'rgba(74,222,128,0.2)' : 'rgba(251,191,36,0.2)'}`,
					}}
				>
					{position.inRange ? '● In range' : '○ Out of range'}
				</span>
			</div>

			{/* Stats grid */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3,1fr)',
					gap: 8,
					marginBottom: 10,
					position: 'relative',
				}}
			>
				{[
					{
						label: 'Position Value',
						value: formatUSD(position.valueUSD),
						color: 'var(--text-primary)',
					},
					{
						label: 'Fees Earned',
						value: formatUSD(position.feesEarned),
						color: 'var(--accent-green)',
					},
					{
						label: 'Pool',
						value: position.poolId.slice(0, 8) + '…',
						color: 'var(--text-tertiary)',
						mono: true,
					},
				].map(s => (
					<div
						key={s.label}
						style={{
							background: 'rgba(255,255,255,0.04)',
							borderRadius: 10,
							padding: '10px 12px',
						}}
					>
						<p
							style={{
								fontSize: 10,
								color: 'var(--text-tertiary)',
								marginBottom: 5,
								fontWeight: 600,
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
			<div style={{ display: 'flex', gap: 8, position: 'relative' }}>
				{[position.token0, position.token1].map((token, i) => (
					<div
						key={i}
						style={{
							flex: 1,
							background: 'rgba(255,255,255,0.03)',
							borderRadius: 10,
							padding: '9px 12px',
							display: 'flex',
							alignItems: 'center',
							gap: 8,
						}}
					>
						<CoinIcon symbol={token.symbol} />
						<div>
							<p
								style={{
									fontSize: 10,
									color: 'var(--text-tertiary)',
									marginBottom: 1,
									fontWeight: 600,
								}}
							>
								Token {i}
							</p>
							<p
								style={{
									fontSize: 12,
									fontWeight: 700,
									color: 'var(--text-primary)',
								}}
							>
								{token.symbol}{' '}
								<span
									style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}
								>
									${token.priceUSD.toFixed(2)}
								</span>
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
