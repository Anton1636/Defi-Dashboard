'use client'

import { usePriceStore } from '@/store/priceStore'

const STREAMS = [
	{
		symbol: 'ETH',
		icon: 'Ξ',
		coinBg: 'rgba(0,229,255,0.1)',
		coinColor: 'var(--accent-blue)',
		fillColor: 'var(--accent-blue)',
		speed: '2s',
		width: 78,
	},
	{
		symbol: 'USDC',
		icon: '$',
		coinBg: 'rgba(0,211,149,0.1)',
		coinColor: 'var(--compound)',
		fillColor: 'var(--compound)',
		speed: '2.5s',
		width: 52,
	},
	{
		symbol: 'USDT',
		icon: '₮',
		coinBg: 'rgba(251,191,36,0.1)',
		coinColor: 'var(--accent-amber)',
		fillColor: 'var(--accent-amber)',
		speed: '3s',
		width: 24,
	},
	{
		symbol: 'WBTC',
		icon: '₿',
		coinBg: 'rgba(247,147,26,0.1)',
		coinColor: '#f7931a',
		fillColor: '#f7931a',
		speed: '3.5s',
		width: 18,
	},
]

export function LiquidityStreams() {
	const prices = usePriceStore(s => s.prices)

	return (
		<div className='panel-card'>
			<div className='panel-title'>
				LIQUIDITY STREAMS
				<span className='panel-link'>24H FLOW ▾</span>
			</div>

			{STREAMS.map(s => {
				const p = prices[s.symbol]
				const change = p?.change24h ?? 0
				const isUp = change >= 0

				return (
					<div
						key={s.symbol}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							marginBottom: 10,
						}}
					>
						<div
							style={{
								width: 22,
								height: 22,
								borderRadius: '50%',
								background: s.coinBg,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 9,
								fontWeight: 800,
								color: s.coinColor,
								flexShrink: 0,
							}}
						>
							{s.icon}
						</div>
						<span
							style={{
								fontSize: 11,
								color: 'var(--text-secondary)',
								width: 36,
								flexShrink: 0,
							}}
						>
							{s.symbol}
						</span>
						<div className='stream-line' style={{ flex: 1 }}>
							<div
								className='stream-fill'
								style={{
									width: `${s.width}%`,
									background: `linear-gradient(90deg,${s.fillColor},rgba(${s.fillColor === 'var(--accent-blue)' ? '0,229,255' : s.fillColor === 'var(--compound)' ? '0,211,149' : s.fillColor === 'var(--accent-amber)' ? '251,191,36' : '247,147,26'},.3),${s.fillColor})`,
									animationDuration: s.speed,
								}}
							/>
						</div>
						<div style={{ textAlign: 'right', minWidth: 50 }}>
							<div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>
								{p?.price
									? `$${p.price > 1000 ? (p.price / 1000).toFixed(1) + 'K' : p.price.toFixed(2)}`
									: '—'}
							</div>
							<div
								style={{
									fontSize: 9,
									fontWeight: 600,
									color: isUp ? 'var(--accent-lime)' : 'var(--accent-red)',
								}}
							>
								{isUp ? '+' : ''}
								{change.toFixed(2)}%
							</div>
						</div>
					</div>
				)
			})}

			<div style={{ textAlign: 'center', marginTop: 8 }}>
				<span
					style={{
						fontSize: 10,
						color: 'var(--accent-blue)',
						fontWeight: 700,
						cursor: 'pointer',
					}}
				>
					View All Assets →
				</span>
			</div>
		</div>
	)
}
