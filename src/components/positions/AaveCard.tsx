import type { AavePosition } from '@/types'

function fmt(v: number) {
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
				? 'rgba(251,191,36,.1)'
				: 'var(--accent-red-glow)'
	const hfPct = Math.min((position.healthFactor / 3) * 100, 100)

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
				e.currentTarget.style.borderColor = 'rgba(182,80,158,.3)'
				e.currentTarget.style.boxShadow = 'var(--shadow-hover)'
				e.currentTarget.style.transform = 'translateY(-2px)'
			}}
			onMouseLeave={e => {
				e.currentTarget.style.borderColor = 'var(--card-border)'
				e.currentTarget.style.boxShadow = 'var(--shadow-card)'
				e.currentTarget.style.transform = 'translateY(0)'
			}}
		>
			{/* Aave accent line */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 2,
					background:
						'linear-gradient(90deg,var(--aave),rgba(182,80,158,.15),transparent)',
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
							width: 40,
							height: 40,
							borderRadius: '50%',
							background: 'var(--aave-glow)',
							border: '1px solid rgba(182,80,158,.25)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 20,
						}}
					>
						👻
					</div>
					<div>
						<p
							style={{
								fontSize: 14,
								fontWeight: 800,
								color: 'var(--text-primary)',
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
						borderRadius: 20,
						background: hfBg,
						color: hfColor,
					}}
				>
					HF: {position.healthFactor.toFixed(2)}
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
						fontWeight: 600,
						marginBottom: 5,
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
						{position.healthFactor < 1.5 ? '⚠ Liquidation risk' : 'Safe'}
					</span>
				</div>
				<div
					style={{
						height: 4,
						background: 'var(--surface-3)',
						borderRadius: 2,
						overflow: 'hidden',
					}}
				>
					<div
						style={{
							height: '100%',
							width: `${hfPct}%`,
							background: hfColor,
							borderRadius: 2,
							boxShadow: `0 0 6px ${hfColor}`,
							transition: 'width .4s ease',
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
						value: fmt(position.valueUSD),
						color: 'var(--text-primary)',
					},
					{
						label: 'Collateral',
						value: fmt(position.totalCollateralUSD),
						color: 'var(--text-primary)',
					},
					{
						label: 'Debt',
						value: fmt(position.totalDebtUSD),
						color: 'var(--accent-red)',
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
							fontSize: 9,
							fontWeight: 800,
							color: 'var(--text-tertiary)',
							letterSpacing: '.12em',
							marginBottom: 6,
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
									background: 'rgba(74,222,128,.05)',
									border: '1px solid rgba(74,222,128,.12)',
									borderRadius: 'var(--card-radius-xs)',
									padding: '7px 11px',
								}}
							>
								<span
									style={{
										fontSize: 13,
										fontWeight: 700,
										color: 'var(--text-primary)',
									}}
								>
									{s.symbol}
								</span>
								<div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
									<span
										style={{ fontSize: 12, color: 'var(--text-secondary)' }}
									>
										{fmt(s.valueUSD)}
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
							fontSize: 9,
							fontWeight: 800,
							color: 'var(--text-tertiary)',
							letterSpacing: '.12em',
							marginBottom: 6,
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
									background: 'rgba(248,113,113,.05)',
									border: '1px solid rgba(248,113,113,.12)',
									borderRadius: 'var(--card-radius-xs)',
									padding: '7px 11px',
								}}
							>
								<span
									style={{
										fontSize: 13,
										fontWeight: 700,
										color: 'var(--text-primary)',
									}}
								>
									{b.symbol}
								</span>
								<div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
									<span
										style={{ fontSize: 12, color: 'var(--text-secondary)' }}
									>
										{fmt(b.valueUSD)}
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
