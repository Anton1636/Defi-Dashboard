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
				? 'rgba(245, 158, 11, 0.1)'
				: 'rgba(239, 68, 68, 0.1)'

	const hfBarColor =
		position.healthFactor > 2
			? 'var(--accent-green)'
			: position.healthFactor > 1.5
				? 'var(--accent-amber)'
				: 'var(--accent-red)'

	const hfPercent = Math.min((position.healthFactor / 3) * 100, 100)

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
				e.currentTarget.style.borderColor = 'var(--aave)44'
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
							background: 'var(--aave-glow)',
							border: '1px solid var(--aave)44',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '20px',
						}}
					>
						👻
					</div>
					<div>
						<p
							style={{
								fontWeight: 600,
								color: 'var(--text-primary)',
								fontSize: '14px',
							}}
						>
							Aave V3
						</p>
						<p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
							Lending · Ethereum
						</p>
					</div>
				</div>
				<span
					style={{
						fontSize: '12px',
						fontWeight: 600,
						padding: '4px 10px',
						borderRadius: '20px',
						background: hfBg,
						color: hfColor,
					}}
				>
					HF: {position.healthFactor.toFixed(2)}
				</span>
			</div>

			{/* Health factor bar */}
			<div style={{ marginBottom: '16px' }}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						fontSize: '11px',
						color: 'var(--text-tertiary)',
						marginBottom: '6px',
					}}
				>
					<span>Health factor</span>
					<span
						style={{
							color:
								position.healthFactor < 1.5
									? 'var(--accent-red)'
									: 'var(--text-tertiary)',
						}}
					>
						{position.healthFactor < 1.5 ? '⚠ Liquidation risk' : 'Safe'}
					</span>
				</div>
				<div
					style={{
						height: '4px',
						background: 'var(--bg-elevated)',
						borderRadius: '2px',
						overflow: 'hidden',
					}}
				>
					<div
						style={{
							height: '100%',
							width: `${hfPercent}%`,
							background: hfBarColor,
							borderRadius: '2px',
							boxShadow: `0 0 8px ${hfBarColor}`,
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
					gap: '8px',
					marginBottom: '16px',
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
						color: 'var(--text-primary)',
					},
					{
						label: 'Debt',
						value: formatUSD(position.totalDebtUSD),
						color: 'var(--accent-red)',
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
						<p style={{ fontSize: '13px', fontWeight: 600, color: stat.color }}>
							{stat.value}
						</p>
					</div>
				))}
			</div>

			{/* Supplies */}
			{position.supplies.length > 0 && (
				<div style={{ marginBottom: '12px' }}>
					<p
						style={{
							fontSize: '11px',
							fontWeight: 500,
							color: 'var(--text-tertiary)',
							marginBottom: '8px',
						}}
					>
						SUPPLIED
					</p>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
						{position.supplies.map(s => (
							<div
								key={s.symbol}
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									background: 'rgba(16, 185, 129, 0.06)',
									border: '1px solid rgba(16, 185, 129, 0.12)',
									borderRadius: '8px',
									padding: '8px 12px',
								}}
							>
								<span
									style={{
										fontSize: '13px',
										fontWeight: 500,
										color: 'var(--text-primary)',
									}}
								>
									{s.symbol}
								</span>
								<div
									style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
								>
									<span
										style={{ fontSize: '12px', color: 'var(--text-secondary)' }}
									>
										{formatUSD(s.valueUSD)}
									</span>
									<span
										style={{
											fontSize: '12px',
											color: 'var(--accent-green)',
											fontWeight: 500,
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
							fontSize: '11px',
							fontWeight: 500,
							color: 'var(--text-tertiary)',
							marginBottom: '8px',
						}}
					>
						BORROWED
					</p>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
						{position.borrows.map(b => (
							<div
								key={b.symbol}
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									background: 'rgba(239, 68, 68, 0.06)',
									border: '1px solid rgba(239, 68, 68, 0.12)',
									borderRadius: '8px',
									padding: '8px 12px',
								}}
							>
								<span
									style={{
										fontSize: '13px',
										fontWeight: 500,
										color: 'var(--text-primary)',
									}}
								>
									{b.symbol}
								</span>
								<div
									style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
								>
									<span
										style={{ fontSize: '12px', color: 'var(--text-secondary)' }}
									>
										{formatUSD(b.valueUSD)}
									</span>
									<span
										style={{
											fontSize: '12px',
											color: 'var(--accent-red)',
											fontWeight: 500,
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
