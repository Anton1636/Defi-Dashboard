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
		bg: 'rgba(245,158,11,0.1)',
		label: '🟡 Normal — acceptable fees',
	},
	high: {
		color: '#f97316',
		bg: 'rgba(249,115,22,0.1)',
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
			<div className='card' style={{ padding: 20 }}>
				<div
					className='skeleton'
					style={{ height: 14, width: '40%', marginBottom: 16 }}
				/>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(3,1fr)',
						gap: 12,
					}}
				>
					{[0, 1, 2].map(i => (
						<div
							key={i}
							className='skeleton'
							style={{ height: 80, borderRadius: 12 }}
						/>
					))}
				</div>
			</div>
		)
	}

	if (!data) return null

	const config = LEVEL_CONFIG[data.level]

	return (
		<div className='card' style={{ padding: 20 }}>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 16,
				}}
			>
				<div>
					<p
						style={{
							fontSize: 14,
							fontWeight: 600,
							color: 'var(--text-primary)',
							marginBottom: 4,
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
						borderRadius: 20,
						background: config.bg,
						color: config.color,
						fontSize: 12,
						fontWeight: 500,
					}}
				>
					{config.label}
				</div>
			</div>

			{/* Tiers */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3,1fr)',
					gap: 10,
					marginBottom: 16,
				}}
			>
				{TIERS.map(tier => {
					const gwei = data[tier.key]
					const costUSD = ((150_000 * gwei) / 1e9) * ethPrice
					const isRecommended = tier.key === 'standard'

					return (
						<div
							key={tier.key}
							style={{
								background: isRecommended ? config.bg : 'var(--bg-elevated)',
								border: `1px solid ${isRecommended ? config.color + '44' : 'var(--border-primary)'}`,
								borderRadius: 12,
								padding: '12px 14px',
								position: 'relative',
							}}
						>
							{isRecommended && (
								<div
									style={{
										position: 'absolute',
										top: -8,
										left: '50%',
										transform: 'translateX(-50%)',
										fontSize: 10,
										fontWeight: 600,
										color: config.color,
										background: 'var(--bg-card)',
										padding: '2px 8px',
										borderRadius: 10,
										border: `1px solid ${config.color}44`,
										whiteSpace: 'nowrap',
									}}
								>
									RECOMMENDED
								</div>
							)}
							<p style={{ fontSize: 16, marginBottom: 2 }}>{tier.icon}</p>
							<p
								style={{
									fontSize: 11,
									color: 'var(--text-tertiary)',
									marginBottom: 4,
								}}
							>
								{tier.label}
							</p>
							<p
								style={{
									fontSize: 18,
									fontWeight: 700,
									color: isRecommended ? config.color : 'var(--text-primary)',
									fontVariantNumeric: 'tabular-nums',
								}}
							>
								{gwei}{' '}
								<span style={{ fontSize: 11, fontWeight: 400 }}>gwei</span>
							</p>
							<p
								style={{
									fontSize: 11,
									color: 'var(--text-tertiary)',
									marginTop: 2,
								}}
							>
								{tier.desc}
							</p>
							<p
								style={{
									fontSize: 11,
									color: 'var(--text-secondary)',
									marginTop: 4,
								}}
							>
								~${costUSD.toFixed(2)} swap
							</p>
						</div>
					)
				})}
			</div>

			{/* Base fee */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
					Base fee:{' '}
					<span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
						{data.baseFee} gwei
					</span>
				</p>
				{lastRefresh && (
					<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
						Updated {lastRefresh.toLocaleTimeString()}
					</p>
				)}
			</div>
		</div>
	)
}
