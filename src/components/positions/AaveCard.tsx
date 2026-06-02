import type { AavePosition } from '@/types'

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
				width: 26,
				height: 26,
				borderRadius: '50%',
				background: cfg.bg,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontSize: 11,
				fontWeight: 800,
				color: cfg.color,
				flexShrink: 0,
			}}
		>
			{cfg.char}
		</div>
	)
}

export function AaveCard({ position }: { position: AavePosition }) {
	const hfColor =
		position.healthFactor > 2
			? 'var(--accent-green)'
			: position.healthFactor > 1.5
				? 'var(--accent-amber)'
				: 'var(--accent-red)'
	const hfBg =
		position.healthFactor > 2
			? 'rgba(74,222,128,0.1)'
			: position.healthFactor > 1.5
				? 'rgba(251,191,36,0.1)'
				: 'rgba(248,113,113,0.1)'
	const hfPercent = Math.min((position.healthFactor / 3) * 100, 100)

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
				e.currentTarget.style.borderColor = 'rgba(123,97,255,0.25)'
				e.currentTarget.style.transform = 'translateY(-2px)'
				e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.5)'
			}}
			onMouseLeave={e => {
				e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
				e.currentTarget.style.transform = 'translateY(0)'
				e.currentTarget.style.boxShadow = 'none'
			}}
		>
			{/* Top line */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 2,
					background:
						'linear-gradient(90deg,#b6509e,rgba(182,80,158,0.1),transparent)',
				}}
			/>

			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 14,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<div
						style={{
							width: 44,
							height: 44,
							borderRadius: '50%',
							background: 'rgba(182,80,158,0.12)',
							border: '1px solid rgba(182,80,158,0.25)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 22,
						}}
					>
						👻
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
							AAVE V3
						</p>
						<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
							Ethereum
						</p>
					</div>
				</div>
				<span
					style={{
						fontSize: 12,
						fontWeight: 700,
						padding: '4px 10px',
						borderRadius: 20,
						background: hfBg,
						color: hfColor,
					}}
				>
					HF {position.healthFactor.toFixed(2)}
				</span>
			</div>

			{/* Health factor bar */}
			<div style={{ marginBottom: 14 }}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						fontSize: 10,
						color: 'var(--text-tertiary)',
						marginBottom: 5,
						fontWeight: 600,
					}}
				>
					<span>Health Factor</span>
					<span
						style={{
							color:
								position.healthFactor < 1.5
									? 'var(--accent-red)'
									: 'var(--text-tertiary)',
						}}
					>
						{position.healthFactor < 1.5 ? '⚠ Risk' : 'Safe'}
					</span>
				</div>
				<div
					style={{
						height: 5,
						background: 'rgba(255,255,255,0.06)',
						borderRadius: 3,
						overflow: 'hidden',
					}}
				>
					<div
						style={{
							height: '100%',
							width: `${hfPercent}%`,
							background: `linear-gradient(90deg,${hfColor},${hfColor}88)`,
							borderRadius: 3,
							boxShadow: `0 0 8px ${hfColor}`,
							transition: 'width 0.4s ease',
						}}
					/>
				</div>
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
						label: 'Net Worth',
						value: formatUSD(position.valueUSD),
						color: 'var(--text-primary)',
					},
					{
						label: 'Collateral',
						value: formatUSD(position.totalCollateralUSD),
						color: 'var(--text-primary)',
					},
					{
						label: 'Debt',
						value: formatUSD(position.totalDebtUSD),
						color: 'var(--accent-red)',
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
						<p style={{ fontSize: 13, fontWeight: 700, color: s.color }}>
							{s.value}
						</p>
					</div>
				))}
			</div>

			{/* Supplied */}
			{position.supplies.length > 0 && (
				<div style={{ marginBottom: 10 }}>
					<p
						style={{
							fontSize: 9,
							fontWeight: 800,
							color: 'var(--text-tertiary)',
							letterSpacing: '0.14em',
							marginBottom: 7,
						}}
					>
						SUPPLIED
					</p>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
						{position.supplies.map(s => (
							<div
								key={s.symbol}
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									background: 'rgba(74,222,128,0.05)',
									border: '1px solid rgba(74,222,128,0.12)',
									borderRadius: 9,
									padding: '8px 11px',
								}}
							>
								<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
									<CoinIcon symbol={s.symbol} />
									<span
										style={{
											fontSize: 13,
											fontWeight: 700,
											color: 'var(--text-primary)',
										}}
									>
										{s.symbol}
									</span>
								</div>
								<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
									<span
										style={{ fontSize: 12, color: 'var(--text-secondary)' }}
									>
										{formatUSD(s.valueUSD)}
									</span>
									<span
										style={{
											fontSize: 12,
											color: 'var(--accent-green)',
											fontWeight: 700,
										}}
									>
										+ {s.apy.toFixed(2)}% APY
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Borrowed */}
			{position.borrows.length > 0 && (
				<div>
					<p
						style={{
							fontSize: 9,
							fontWeight: 800,
							color: 'var(--text-tertiary)',
							letterSpacing: '0.14em',
							marginBottom: 7,
						}}
					>
						BORROWED
					</p>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
						{position.borrows.map(b => (
							<div
								key={b.symbol}
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									background: 'rgba(248,113,113,0.05)',
									border: '1px solid rgba(248,113,113,0.12)',
									borderRadius: 9,
									padding: '8px 11px',
								}}
							>
								<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
									<CoinIcon symbol={b.symbol} />
									<span
										style={{
											fontSize: 13,
											fontWeight: 700,
											color: 'var(--text-primary)',
										}}
									>
										{b.symbol}
									</span>
								</div>
								<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
									<span
										style={{ fontSize: 12, color: 'var(--text-secondary)' }}
									>
										{formatUSD(b.valueUSD)}
									</span>
									<span
										style={{
											fontSize: 12,
											color: 'var(--accent-red)',
											fontWeight: 700,
										}}
									>
										+ {b.apy.toFixed(2)}% APR
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
