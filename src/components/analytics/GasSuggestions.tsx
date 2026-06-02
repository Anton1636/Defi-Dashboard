'use client'

import { useGas } from '@/hooks/useGas'
import { usePriceStore } from '@/store/priceStore'
import { usePortfolio } from '@/hooks/usePortfolio'
import { estimateOpCost, GAS_UNITS } from '@/lib/gas'
import type { AavePosition, UniswapPosition, CompoundPosition } from '@/types'

interface Suggestion {
	id: string
	urgency: 'critical' | 'warning' | 'info' | 'good'
	icon: string
	iconBg: string
	title: string
	description: string
	estimatedCost?: string
	actionLabel?: string
	actionColor?: string
}

const URGENCY_CFG = {
	critical: {
		color: '#f87171',
		bg: 'rgba(248,113,113,.06)',
		border: 'rgba(248,113,113,.15)',
		badge: 'Critical',
		badgeBg: 'rgba(248,113,113,.12)',
	},
	warning: {
		color: '#fbbf24',
		bg: 'rgba(251,191,36,.05)',
		border: 'rgba(251,191,36,.15)',
		badge: 'Warning',
		badgeBg: 'rgba(251,191,36,.1)',
	},
	info: {
		color: 'var(--accent-blue)',
		bg: 'rgba(0,229,255,.04)',
		border: 'rgba(0,229,255,.12)',
		badge: 'Info',
		badgeBg: 'rgba(0,229,255,.08)',
	},
	good: {
		color: '#4ade80',
		bg: 'rgba(74,222,128,.04)',
		border: 'rgba(74,222,128,.12)',
		badge: 'Optimal',
		badgeBg: 'rgba(74,222,128,.1)',
	},
}

const ACTION_LABELS: Record<string, string> = {
	good: 'Optimal',
	info: 'Healthy',
	warning: 'Warning',
	critical: 'Critical',
}

export function GasSuggestions() {
	const { data: gas } = useGas()
	const { data: portfolio } = usePortfolio()
	const ethPrice = usePriceStore(s => s.prices['ETH']?.price ?? 3000)

	if (!gas || !portfolio) return null

	const suggestions: Suggestion[] = []
	const stdGwei = gas.standard

	for (const pos of portfolio.positions) {
		if (pos.protocol === 'uniswap') {
			const p = pos as UniswapPosition
			if (!p.inRange) {
				const cost = estimateOpCost(
					GAS_UNITS.uniswapRemoveLiquidity + GAS_UNITS.uniswapAddLiquidity,
					stdGwei,
					ethPrice,
				)
				suggestions.push({
					id: `uni-${p.id}`,
					urgency: 'warning',
					icon: '🦄',
					iconBg: 'rgba(255,0,122,.12)',
					title: `${p.token0.symbol}/${p.token1.symbol} — Out of range`,
					description:
						gas.level === 'low'
							? 'Gas is low — good time to rebalance your position back into range.'
							: 'Position is out of range and not earning fees. Wait for lower gas.',
					estimatedCost: `~$${cost.toFixed(2)}`,
					actionLabel: 'Rebalance',
				})
			} else {
				suggestions.push({
					id: `uni-ok-${p.id}`,
					urgency: 'good',
					icon: '✅',
					iconBg: 'rgba(74,222,128,.12)',
					title: `${p.token0.symbol}/${p.token1.symbol} — In range`,
					description: 'Position is actively earning fees. No action needed.',
					actionLabel: 'Optimal',
				})
			}
		}
		if (pos.protocol === 'aave') {
			const p = pos as AavePosition
			if (p.healthFactor < 1.5) {
				const cost = estimateOpCost(GAS_UNITS.aaveSupply, stdGwei, ethPrice)
				suggestions.push({
					id: `aave-crit-${p.id}`,
					urgency: 'critical',
					icon: '🚨',
					iconBg: 'rgba(248,113,113,.12)',
					title: 'Aave — Liquidation Risk!',
					description: `Health factor ${p.healthFactor.toFixed(2)} is dangerously low. Add collateral immediately.`,
					estimatedCost: `~$${cost.toFixed(2)}`,
					actionLabel: 'Act Now',
				})
			} else {
				const cost = estimateOpCost(GAS_UNITS.aaveRepay, stdGwei, ethPrice)
				suggestions.push({
					id: `aave-ok-${p.id}`,
					urgency: 'info',
					icon: '👻',
					iconBg: 'rgba(182,80,158,.12)',
					title: 'Aave — Position healthy',
					description: `Health factor ${p.healthFactor.toFixed(2)} is safe. Net APY: ${p.netAPY.toFixed(2)}%. Borrow cost: ~$${cost.toFixed(2)}.`,
					actionLabel: 'Healthy',
				})
			}
		}
		if (pos.protocol === 'compound') {
			const p = pos as CompoundPosition
			const cost = estimateOpCost(GAS_UNITS.compoundWithdraw, stdGwei, ethPrice)
			const daily = (p.supplied * p.supplyAPR) / 100 / 365
			suggestions.push({
				id: `comp-${p.id}`,
				urgency: gas.level === 'low' ? 'good' : 'info',
				icon: '🏦',
				iconBg: 'rgba(0,211,149,.12)',
				title: `Compound — ${p.market} market`,
				description: `You earn +${p.supplyAPR.toFixed(2)}% APY at ${p.supplyAPR.toFixed(2)}% APR. Withdrawal costs ~$${cost.toFixed(2)} at current gas.`,
				estimatedCost: `~$${daily.toFixed(2)}/day`,
				actionLabel: 'Good',
			})
		}
	}

	if (!suggestions.length) return null

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
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 2,
					background:
						'linear-gradient(90deg,#fbbf24,rgba(251,191,36,.2),transparent)',
					opacity: 0.7,
				}}
			/>

			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 8,
					marginBottom: 16,
				}}
			>
				<div
					style={{
						width: 28,
						height: 28,
						borderRadius: 8,
						background: 'rgba(251,191,36,.1)',
						border: '1px solid rgba(251,191,36,.2)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 14,
					}}
				>
					💡
				</div>
				<p
					style={{
						fontSize: 15,
						fontWeight: 800,
						color: 'var(--text-primary)',
					}}
				>
					Optimization Suggestions
				</p>
			</div>

			<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
				{suggestions.map(s => {
					const c = URGENCY_CFG[s.urgency]
					return (
						<div
							key={s.id}
							style={{
								background: c.bg,
								border: `1px solid ${c.border}`,
								borderRadius: 12,
								padding: '13px 16px',
								display: 'flex',
								alignItems: 'center',
								gap: 12,
								transition: 'all .15s',
								cursor: 'default',
							}}
							onMouseEnter={e => {
								e.currentTarget.style.borderColor = c.color + '44'
							}}
							onMouseLeave={e => {
								e.currentTarget.style.borderColor = c.border
							}}
						>
							{/* Icon */}
							<div
								style={{
									width: 34,
									height: 34,
									borderRadius: 10,
									background: s.iconBg,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: 17,
									flexShrink: 0,
								}}
							>
								{s.icon}
							</div>
							{/* Text */}
							<div style={{ flex: 1, minWidth: 0 }}>
								<p
									style={{
										fontSize: 13,
										fontWeight: 700,
										color: c.color,
										marginBottom: 2,
									}}
								>
									{s.title}
								</p>
								<p
									style={{
										fontSize: 12,
										color: 'var(--text-secondary)',
										lineHeight: 1.5,
									}}
								>
									{s.description}
								</p>
							</div>
							{/* Badge */}
							<div
								style={{
									padding: '4px 12px',
									borderRadius: 20,
									background: c.badgeBg,
									border: `1px solid ${c.border}`,
									fontSize: 11,
									fontWeight: 800,
									color: c.color,
									whiteSpace: 'nowrap',
									flexShrink: 0,
									display: 'flex',
									alignItems: 'center',
									gap: 5,
								}}
							>
								{s.actionLabel ?? ACTION_LABELS[s.urgency]}
								<span style={{ fontSize: 12 }}>›</span>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
