import type { AavePosition } from '@/types'

function formatUSD(v: number) {
	if (v >= 1000) return `$${(v / 1000).toFixed(2)}K`
	return `$${v.toFixed(2)}`
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
			? 'var(--accent-green-glow)'
			: position.healthFactor > 1.5
				? 'rgba(255,214,10,0.1)'
				: 'var(--accent-red-glow)'
	const hfPercent = Math.min((position.healthFactor / 3) * 100, 100)

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
				e.currentTarget.style.borderColor = 'rgba(182,80,158,0.3)'
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
							background: 'var(--aave-glow)',
							border: '1px solid rgba(182,80,158,0.2)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 18,
						}}
					>
						👻
					</div>
					<div>
						<p
							style={{
								fontWeight: 700,
								color: 'var(--text-primary)',
								fontSize: 14,
							}}
						>
							Aave V3
						</p>
						<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
							Lending · Ethereum
						</p>
					</div>
				</div>
				<span
					style={{
						fontSize: 11,
						fontWeight: 700,
						padding: '4px 10px',
						borderRadius: 8,
						background: hfBg,
						color: hfColor,
					}}
				>
					HF: {position.healthFactor.toFixed(2)}
				</span>
			</div>

			{/* Health factor */}
			<div style={{ marginBottom: 14 }}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						fontSize: 11,
						marginBottom: 5,
					}}
				>
					<span style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>
						Health factor
					</span>
					<span
						style={{
							color:
								position.healthFactor < 1.5
									? 'var(--accent-red)'
									: 'var(--text-tertiary)',
							fontWeight: 600,
						}}
					>
						{position.healthFactor < 1.5 ? '⚠ Liquidation risk' : 'Safe'}
					</span>
				</div>
				<div
					style={{
						height: 4,
						background: 'var(--bg-elevated)',
						borderRadius: 2,
						overflow: 'hidden',
					}}
				>
					<div
						style={{
							height: '100%',
							width: `${hfPercent}%`,
							background: hfColor,
							borderRadius: 2,
							boxShadow: `0 0 6px ${hfColor}`,
							transition: 'width 0.4s ease',
						}}
					/>
				</div>
			</div>

			{/* Stats */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: 6,
					marginBottom: 12,
				}}
			>
				{[
					{
						label: 'Net worth',
						value: formatUSD(position.valueUSD),
						color: 'var(--text-primary)',
					},
					{
						label: 'Collateral',
						value: formatUSD(position.totalCollateralUSD),
						color: 'var(--accent-green)',
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
						<p style={{ fontSize: 13, fontWeight: 700, color: s.color }}>
							{s.value}
						</p>
					</div>
				))}
			</div>

			{/* Supplies */}
			{position.supplies.length > 0 && (
				<div style={{ marginBottom: 10 }}>
					<p
						style={{
							fontSize: 10,
							fontWeight: 700,
							color: 'var(--text-tertiary)',
							marginBottom: 6,
							textTransform: 'uppercase',
							letterSpacing: '0.08em',
						}}
					>
						Supplied
					</p>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
						{position.supplies.map(s => (
							<div
								key={s.symbol}
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									background: 'rgba(48,209,88,0.05)',
									border: '1px solid rgba(48,209,88,0.1)',
									borderRadius: 8,
									padding: '7px 10px',
								}}
							>
								<span
									style={{
										fontSize: 13,
										fontWeight: 600,
										color: 'var(--text-primary)',
									}}
								>
									{s.symbol}
								</span>
								<div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
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
										{s.apy.toFixed(2)}% APY
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Borrows */}
			{position.borrows.length > 0 && (
				<div>
					<p
						style={{
							fontSize: 10,
							fontWeight: 700,
							color: 'var(--text-tertiary)',
							marginBottom: 6,
							textTransform: 'uppercase',
							letterSpacing: '0.08em',
						}}
					>
						Borrowed
					</p>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
						{position.borrows.map(b => (
							<div
								key={b.symbol}
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									background: 'rgba(255,69,58,0.05)',
									border: '1px solid rgba(255,69,58,0.1)',
									borderRadius: 8,
									padding: '7px 10px',
								}}
							>
								<span
									style={{
										fontSize: 13,
										fontWeight: 600,
										color: 'var(--text-primary)',
									}}
								>
									{b.symbol}
								</span>
								<div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
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
										{b.apy.toFixed(2)}% APR
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
