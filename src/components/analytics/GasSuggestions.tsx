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
	title: string
	description: string
	estimatedCost?: string
	action?: string
}

const URGENCY_CONFIG = {
	critical: {
		color: 'var(--accent-red)',
		bg: 'var(--accent-red-glow)',
		border: 'rgba(239,68,68,0.2)',
	},
	warning: {
		color: 'var(--accent-amber)',
		bg: 'rgba(245,158,11,0.08)',
		border: 'rgba(245,158,11,0.2)',
	},
	info: {
		color: 'var(--accent-blue)',
		bg: 'var(--accent-blue-glow)',
		border: 'rgba(99,102,241,0.2)',
	},
	good: {
		color: 'var(--accent-green)',
		bg: 'var(--accent-green-glow)',
		border: 'rgba(16,185,129,0.2)',
	},
}

export function GasSuggestions() {
	const { data: gas } = useGas()
	const { data: portfolio } = usePortfolio()
	const ethPrice = usePriceStore(s => s.prices['ETH']?.price ?? 3000)

	if (!gas || !portfolio) return null

	const suggestions: Suggestion[] = []
	const standardGwei = gas.standard

	for (const pos of portfolio.positions) {
		// Uniswap — out of range
		if (pos.protocol === 'uniswap') {
			const p = pos as UniswapPosition
			if (!p.inRange) {
				const rebalanceCost = estimateOpCost(
					GAS_UNITS.uniswapRemoveLiquidity + GAS_UNITS.uniswapAddLiquidity,
					standardGwei,
					ethPrice,
				)
				suggestions.push({
					id: `uni-${p.id}`,
					urgency: gas.level === 'low' ? 'good' : 'warning',
					icon: '🦄',
					title: `${p.token0.symbol}/${p.token1.symbol} — Out of range`,
					description:
						gas.level === 'low'
							? `Gas is low right now — good time to rebalance your Uniswap position back into range.`
							: `Your position is out of range and not earning fees. Wait for lower gas before rebalancing.`,
					estimatedCost: `~$${rebalanceCost.toFixed(2)}`,
					action: gas.level === 'low' ? 'Rebalance now' : 'Wait for lower gas',
				})
			} else {
				suggestions.push({
					id: `uni-ok-${p.id}`,
					urgency: 'good',
					icon: '✅',
					title: `${p.token0.symbol}/${p.token1.symbol} — In range`,
					description: 'Position is actively earning fees. No action needed.',
				})
			}
		}

		// Aave — health factor warning
		if (pos.protocol === 'aave') {
			const p = pos as AavePosition
			if (p.healthFactor < 1.5) {
				const addCollateralCost = estimateOpCost(
					GAS_UNITS.aaveSupply,
					standardGwei,
					ethPrice,
				)
				suggestions.push({
					id: `aave-crit-${p.id}`,
					urgency: 'critical',
					icon: '🚨',
					title: 'Aave — Liquidation Risk!',
					description: `Health factor ${p.healthFactor.toFixed(2)} is dangerously low. Add collateral immediately regardless of gas cost.`,
					estimatedCost: `~$${addCollateralCost.toFixed(2)}`,
					action: 'Add collateral NOW',
				})
			} else if (p.healthFactor < 2) {
				const addCollateralCost = estimateOpCost(
					GAS_UNITS.aaveSupply,
					standardGwei,
					ethPrice,
				)
				suggestions.push({
					id: `aave-warn-${p.id}`,
					urgency: 'warning',
					icon: '⚠️',
					title: 'Aave — Monitor Health Factor',
					description: `Health factor ${p.healthFactor.toFixed(2)} is below safe threshold. ${gas.level === 'low' ? 'Gas is low — consider adding collateral now.' : 'Wait for lower gas if not urgent.'}`,
					estimatedCost: `~$${addCollateralCost.toFixed(2)}`,
					action: 'Add collateral',
				})
			} else {
				// Check if it's worth claiming rewards
				const repayCost = estimateOpCost(
					GAS_UNITS.aaveRepay,
					standardGwei,
					ethPrice,
				)
				suggestions.push({
					id: `aave-ok-${p.id}`,
					urgency: 'info',
					icon: '👻',
					title: 'Aave — Position healthy',
					description: `Health factor ${p.healthFactor.toFixed(2)} is safe. Net APY: ${p.netAPY.toFixed(2)}%. Repay cost: ~$${repayCost.toFixed(2)}.`,
				})
			}
		}

		// Compound — reward claiming
		if (pos.protocol === 'compound') {
			const p = pos as CompoundPosition
			const withdrawCost = estimateOpCost(
				GAS_UNITS.compoundWithdraw,
				standardGwei,
				ethPrice,
			)
			const dailyEarnings = (p.supplied * p.supplyAPR) / 100 / 365

			suggestions.push({
				id: `comp-${p.id}`,
				urgency: gas.level === 'low' ? 'good' : 'info',
				icon: '🏦',
				title: `Compound — ${p.market} market`,
				description:
					gas.level === 'low'
						? `Gas is low! You earn ~$${dailyEarnings.toFixed(2)}/day. Withdrawal would cost ~$${withdrawCost.toFixed(2)} now — a good deal.`
						: `You earn ~$${dailyEarnings.toFixed(2)}/day at ${p.supplyAPR.toFixed(2)}% APR. Withdrawal costs ~$${withdrawCost.toFixed(2)} at current gas.`,
				estimatedCost: `~$${withdrawCost.toFixed(2)}`,
			})
		}
	}

	if (gas.level === 'low') {
		suggestions.unshift({
			id: 'gas-low',
			urgency: 'good',
			icon: '⛽',
			title: 'Gas is low — good time to act',
			description: `Current gas (${standardGwei} gwei) is below average. If you have any pending DeFi actions, now is a good time to execute them.`,
		})
	} else if (gas.level === 'very-high') {
		suggestions.unshift({
			id: 'gas-high',
			urgency: 'warning',
			icon: '⛽',
			title: 'Gas is very high — wait if possible',
			description: `Current gas (${standardGwei} gwei) is unusually high. Avoid non-urgent transactions. Check back in a few hours.`,
		})
	}

	return (
		<div>
			<p
				style={{
					fontSize: 14,
					fontWeight: 600,
					color: 'var(--text-primary)',
					marginBottom: 14,
				}}
			>
				💡 Optimization Suggestions
			</p>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
				{suggestions.map(s => {
					const cfg = URGENCY_CONFIG[s.urgency]
					return (
						<div
							key={s.id}
							style={{
								background: cfg.bg,
								border: `1px solid ${cfg.border}`,
								borderRadius: 12,
								padding: '14px 16px',
								display: 'flex',
								gap: 12,
								alignItems: 'flex-start',
							}}
						>
							<span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
							<div style={{ flex: 1, minWidth: 0 }}>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										marginBottom: 4,
										gap: 8,
									}}
								>
									<p
										style={{ fontSize: 13, fontWeight: 600, color: cfg.color }}
									>
										{s.title}
									</p>
									{s.estimatedCost && (
										<span
											style={{
												fontSize: 11,
												color: 'var(--text-tertiary)',
												whiteSpace: 'nowrap',
												flexShrink: 0,
											}}
										>
											{s.estimatedCost}
										</span>
									)}
								</div>
								<p
									style={{
										fontSize: 12,
										color: 'var(--text-secondary)',
										lineHeight: 1.5,
									}}
								>
									{s.description}
								</p>
								{s.action && (
									<p
										style={{
											fontSize: 11,
											fontWeight: 600,
											color: cfg.color,
											marginTop: 6,
										}}
									>
										→ {s.action}
									</p>
								)}
							</div>
						</div>
					)
				})}

				{suggestions.length === 0 && (
					<div
						style={{
							textAlign: 'center',
							padding: '32px 0',
							color: 'var(--text-tertiary)',
						}}
					>
						<p style={{ fontSize: 24, marginBottom: 8 }}>✅</p>
						<p style={{ fontSize: 13 }}>All positions look good!</p>
					</div>
				)}
			</div>
		</div>
	)
}
