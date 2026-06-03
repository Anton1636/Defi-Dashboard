'use client'

import { useGas } from '@/hooks/useGas'
import { usePriceStore } from '@/store/priceStore'

const LEVEL_CFG = {
	low: {
		color: '#4ade80',
		bg: 'rgba(74,222,128,.08)',
		border: 'rgba(74,222,128,.2)',
		label: '● Normal — acceptable fees',
	},
	normal: {
		color: '#fbbf24',
		bg: 'rgba(251,191,36,.08)',
		border: 'rgba(251,191,36,.2)',
		label: '● Normal — acceptable fees',
	},
	high: {
		color: '#f97316',
		bg: 'rgba(249,115,22,.08)',
		border: 'rgba(249,115,22,.2)',
		label: '● High — consider waiting',
	},
	'very-high': {
		color: '#f87171',
		bg: 'rgba(248,113,113,.08)',
		border: 'rgba(248,113,113,.2)',
		label: '● Very high — wait if possible',
	},
}

const TIERS = [
	{
		key: 'slow' as const,
		icon: '🏳',
		label: 'Low',
		desc: '~5 min',
		sparkType: 'low' as const,
	},
	{
		key: 'standard' as const,
		icon: '⚡',
		label: 'Normal',
		desc: '~1 min',
		sparkType: 'normal' as const,
	},
	{
		key: 'fast' as const,
		icon: '🚀',
		label: 'High',
		desc: '~15 sec',
		sparkType: 'high' as const,
	},
]

function Sparkline({
	color,
	type,
}: {
	color: string
	type: 'low' | 'normal' | 'high'
}) {
	const paths = {
		low: 'M0,18 C20,16 40,20 60,14 C80,8 100,12 120,10 C140,8 155,6 170,4',
		normal: 'M0,14 C20,10 40,16 60,8 C80,4 100,10 120,12 C140,14 155,6 170,8',
		high: 'M0,10 C20,14 40,6 60,18 C80,20 100,8 120,14 C140,18 155,6 170,12',
	}
	return (
		<svg
			viewBox='0 0 170 24'
			preserveAspectRatio='none'
			style={{ width: '100%', height: 36, opacity: 0.75 }}
		>
			<path
				d={paths[type]}
				fill='none'
				stroke={color}
				strokeWidth='1.5'
				strokeLinecap='round'
			/>
		</svg>
	)
}

export function GasWidget() {
	const { data, isLoading, lastRefresh } = useGas()
	const ethPrice = usePriceStore(s => s.prices['ETH']?.price ?? 3000)

	if (isLoading) {
		return (
			<div
				style={{
					background: 'rgba(255,255,255,.02)',
					border: '1px solid rgba(255,255,255,.07)',
					borderRadius: 16,
					padding: 20,
				}}
			>
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
							style={{ height: 120, borderRadius: 12 }}
						/>
					))}
				</div>
			</div>
		)
	}
	if (!data) return null

	const cfg = LEVEL_CFG[data.level]

	return (
		<div
			style={{
				background: 'rgba(255,255,255,.02)',
				border: '1px solid rgba(255,255,255,.07)',
				borderRadius: 16,
				padding: 20,
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			{/* Top gradient line */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 2,
					background:
						'linear-gradient(90deg,var(--accent-blue),var(--accent-purple),transparent)',
					opacity: 0.6,
				}}
			/>

			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'flex-start',
					justifyContent: 'space-between',
					marginBottom: 18,
				}}
			>
				<div>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							marginBottom: 4,
						}}
					>
						<p
							style={{
								fontSize: 15,
								fontWeight: 800,
								color: 'var(--text-primary)',
							}}
						>
							⛽ Gas Prices
						</p>
						<div
							style={{
								width: 16,
								height: 16,
								borderRadius: '50%',
								border: '1px solid rgba(255,255,255,.2)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 9,
								color: 'var(--text-tertiary)',
								cursor: 'pointer',
							}}
						>
							i
						</div>
					</div>
					<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
						Real-time network conditions on Ethereum
					</p>
				</div>
				<div
					style={{
						padding: '4px 12px',
						borderRadius: 20,
						background: cfg.bg,
						border: `1px solid ${cfg.border}`,
						fontSize: 11,
						fontWeight: 700,
						color: cfg.color,
						whiteSpace: 'nowrap',
					}}
				>
					{cfg.label}
				</div>
			</div>

			{/* Tier cards */}
			<div
				className='gas-tiers-grid'
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3,1fr)',
					gap: 10,
					marginBottom: 14,
				}}
			>
				{TIERS.map(tier => {
					const gwei = data[tier.key]
					const costUSD = ((150_000 * gwei) / 1e9) * ethPrice
					const isRec = tier.key === 'standard'
					const tierCfg = {
						slow: {
							color: '#4ade80',
							border: 'rgba(74,222,128,.2)',
							bg: 'rgba(74,222,128,.06)',
						},
						standard: { color: cfg.color, border: cfg.border, bg: cfg.bg },
						fast: {
							color: '#f87171',
							border: 'rgba(248,113,113,.2)',
							bg: 'rgba(248,113,113,.06)',
						},
					}[tier.key]

					return (
						<div
							key={tier.key}
							style={{
								background: tierCfg.bg,
								border: `1px solid ${tierCfg.border}`,
								borderRadius: 12,
								padding: '14px 14px 8px',
								position: 'relative',
							}}
						>
							{isRec && (
								<div
									style={{
										position: 'absolute',
										top: -9,
										left: '50%',
										transform: 'translateX(-50%)',
										fontSize: 9,
										fontWeight: 800,
										color: tierCfg.color,
										background: 'var(--bg-primary)',
										padding: '2px 8px',
										borderRadius: 10,
										border: `1px solid ${tierCfg.border}`,
										whiteSpace: 'nowrap',
										letterSpacing: '.08em',
									}}
								>
									RECOMMENDED
								</div>
							)}
							<div style={{ fontSize: 18, marginBottom: 5 }}>{tier.icon}</div>
							<div
								style={{
									fontSize: 11,
									fontWeight: 700,
									color: tierCfg.color,
									marginBottom: 4,
								}}
							>
								{tier.label}
							</div>
							<div
								style={{
									fontSize: 26,
									fontWeight: 900,
									color: 'var(--text-primary)',
									letterSpacing: '-1px',
									lineHeight: 1,
									fontVariantNumeric: 'tabular-nums',
								}}
							>
								{gwei}{' '}
								<span
									style={{
										fontSize: 11,
										fontWeight: 400,
										color: 'var(--text-tertiary)',
									}}
								>
									gwei
								</span>
							</div>
							<p
								style={{
									fontSize: 11,
									color: 'var(--text-tertiary)',
									marginTop: 4,
								}}
							>
								~${costUSD.toFixed(2)}
							</p>
							<p
								style={{
									fontSize: 10,
									color: isRec ? tierCfg.color : 'var(--text-tertiary)',
									fontWeight: isRec ? 600 : 400,
									marginTop: 1,
								}}
							>
								{isRec
									? 'Mid Market'
									: `Save ~${tier.key === 'slow' ? '35' : '15'}%`}
							</p>
							<Sparkline color={tierCfg.color} type={tier.sparkType} />
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
					paddingTop: 10,
					borderTop: '1px solid rgba(255,255,255,.06)',
				}}
			>
				<p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
					Base fee:{' '}
					<span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
						{data.baseFee} gwei
					</span>
				</p>
				{lastRefresh && (
					<p
						style={{
							fontSize: 11,
							color: 'var(--text-tertiary)',
							display: 'flex',
							alignItems: 'center',
							gap: 5,
						}}
					>
						Updated: {lastRefresh.toLocaleTimeString()}{' '}
						<span style={{ cursor: 'pointer' }}>↻</span>
					</p>
				)}
			</div>
		</div>
	)
}
