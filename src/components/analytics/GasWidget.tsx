'use client'

import { useGas } from '@/hooks/useGas'
import { usePriceStore } from '@/store/priceStore'

const LEVEL_CONFIG = {
	low: {
		color: 'var(--accent-green)',
		bg: 'var(--accent-green-glow)',
		label: '🟢 Low — great time to transact',
	},
	normal: {
		color: 'var(--accent-amber)',
		bg: 'rgba(255,214,10,0.08)',
		label: '🟡 Normal — acceptable fees',
	},
	high: {
		color: '#ff9f0a',
		bg: 'rgba(255,159,10,0.08)',
		label: '🟠 High — consider waiting',
	},
	'very-high': {
		color: 'var(--accent-red)',
		bg: 'var(--accent-red-glow)',
		label: '🔴 Very high — wait if possible',
	},
}

const TIERS = [
	{ key: 'slow' as const, icon: '🐢', label: 'Slow', desc: '~5 min' },
	{ key: 'standard' as const, icon: '⚡', label: 'Standard', desc: '~1 min' },
	{ key: 'fast' as const, icon: '🚀', label: 'Fast', desc: '~15 sec' },
]

export function GasWidget() {
	const { data, isLoading, lastRefresh } = useGas()
	const ethPrice = usePriceStore(s => s.prices['ETH']?.price ?? 3000)

	if (isLoading) {
		return (
			<div
				style={{
					background: 'var(--bg-card)',
					border: '1px solid var(--border-primary)',
					borderRadius: 14,
					padding: 18,
				}}
			>
				<div
					className='skeleton'
					style={{ height: 12, width: '40%', marginBottom: 14 }}
				/>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(3,1fr)',
						gap: 8,
					}}
				>
					{[0, 1, 2].map(i => (
						<div
							key={i}
							className='skeleton'
							style={{ height: 80, borderRadius: 10 }}
						/>
					))}
				</div>
			</div>
		)
	}

	if (!data) return null

	const cfg = LEVEL_CONFIG[data.level]

	return (
		<div
			style={{
				background: 'var(--bg-card)',
				border: '1px solid var(--border-primary)',
				borderRadius: 14,
				padding: 18,
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
				<div>
					<p
						style={{
							fontSize: 14,
							fontWeight: 700,
							color: 'var(--text-primary)',
							marginBottom: 2,
						}}
					>
						⛽ Gas Prices
					</p>
					<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
						Ethereum Mainnet · updates every 15s
					</p>
				</div>
				<div
					style={{
						padding: '4px 12px',
						borderRadius: 8,
						background: cfg.bg,
						color: cfg.color,
						fontSize: 11,
						fontWeight: 700,
						border: `1px solid ${cfg.color}33`,
					}}
				>
					{cfg.label}
				</div>
			</div>

			{/* Tiers */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3,1fr)',
					gap: 8,
					marginBottom: 12,
				}}
			>
				{TIERS.map(tier => {
					const gwei = data[tier.key]
					const costUSD = ((150_000 * gwei) / 1e9) * ethPrice
					const isRec = tier.key === 'standard'

					return (
						<div
							key={tier.key}
							style={{
								background: isRec ? `${cfg.color}10` : 'var(--bg-elevated)',
								border: `1px solid ${isRec ? cfg.color + '33' : 'var(--border-primary)'}`,
								borderRadius: 10,
								padding: '12px',
								position: 'relative',
							}}
						>
							{isRec && (
								<div
									style={{
										position: 'absolute',
										top: -8,
										left: '50%',
										transform: 'translateX(-50%)',
										fontSize: 9,
										fontWeight: 800,
										color: cfg.color,
										background: 'var(--bg-card)',
										padding: '2px 8px',
										borderRadius: 20,
										border: `1px solid ${cfg.color}33`,
										whiteSpace: 'nowrap',
										letterSpacing: '0.08em',
									}}
								>
									RECOMMENDED
								</div>
							)}
							<p style={{ fontSize: 16, marginBottom: 4 }}>{tier.icon}</p>
							<p
								style={{
									fontSize: 10,
									color: 'var(--text-tertiary)',
									fontWeight: 600,
									textTransform: 'uppercase',
									letterSpacing: '0.06em',
									marginBottom: 4,
								}}
							>
								{tier.label}
							</p>
							<p
								style={{
									fontSize: 20,
									fontWeight: 800,
									color: isRec ? cfg.color : 'var(--text-primary)',
									fontVariantNumeric: 'tabular-nums',
									lineHeight: 1,
									marginBottom: 2,
								}}
							>
								{gwei}
								<span
									style={{
										fontSize: 11,
										fontWeight: 500,
										color: 'var(--text-tertiary)',
										marginLeft: 3,
									}}
								>
									gwei
								</span>
							</p>
							<p
								style={{
									fontSize: 10,
									color: 'var(--text-tertiary)',
									marginBottom: 2,
								}}
							>
								{tier.desc}
							</p>
							<p
								style={{
									fontSize: 11,
									color: 'var(--text-secondary)',
									fontWeight: 600,
								}}
							>
								~${costUSD.toFixed(2)} swap
							</p>
						</div>
					)
				})}
			</div>

			{/* Footer */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
					Base fee:{' '}
					<span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>
						{data.baseFee} gwei
					</span>
				</p>
				{lastRefresh && (
					<p style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
						Updated {lastRefresh.toLocaleTimeString()}
					</p>
				)}
			</div>
		</div>
	)
}
