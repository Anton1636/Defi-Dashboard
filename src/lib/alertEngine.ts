import type { DeFiPosition, AavePosition, UniswapPosition } from '@/types'

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success'

export interface Alert {
	id: string
	type:
		| 'liquidation'
		| 'out_of_range'
		| 'gas_low'
		| 'price_change'
		| 'hf_warning'
		| 'fees_earned'
	severity: AlertSeverity
	title: string
	description: string
	protocol?: string
	value?: string
	timestamp: Date
	read: boolean
	actionLabel?: string
	actionHref?: string
}

interface AlertEngineInput {
	positions: DeFiPosition[]
	gasGwei?: number
	ethPrice?: number
	ethChange24h?: number
}

export function generateAlerts({
	positions,
	gasGwei = 0,
	ethPrice = 0,
	ethChange24h = 0,
}: AlertEngineInput): Alert[] {
	const alerts: Alert[] = []
	const now = new Date()

	positions.forEach((pos, i) => {
		// ── Aave: Liquidation risk ──
		if (pos.protocol === 'aave') {
			const aave = pos as AavePosition
			if (aave.healthFactor < 1.2) {
				alerts.push({
					id: `aave-liq-${pos.id}`,
					type: 'liquidation',
					severity: 'critical',
					title: 'Liquidation Risk!',
					description: `Health Factor ${aave.healthFactor.toFixed(2)} is critically low. Add collateral immediately.`,
					protocol: 'Aave V3',
					value: `HF: ${aave.healthFactor.toFixed(2)}`,
					timestamp: new Date(now.getTime() - i * 60_000),
					read: false,
					actionLabel: 'Add Collateral',
					actionHref: '/positions',
				})
			} else if (aave.healthFactor < 1.5) {
				alerts.push({
					id: `aave-warn-${pos.id}`,
					type: 'hf_warning',
					severity: 'warning',
					title: 'Health Factor Warning',
					description: `Health Factor ${aave.healthFactor.toFixed(2)} is approaching unsafe levels.`,
					protocol: 'Aave V3',
					value: `HF: ${aave.healthFactor.toFixed(2)}`,
					timestamp: new Date(now.getTime() - i * 60_000),
					read: false,
					actionLabel: 'View Position',
					actionHref: '/positions',
				})
			}
		}

		// ── Uniswap: Out of range ──
		if (pos.protocol === 'uniswap') {
			const uni = pos as UniswapPosition
			if (!uni.inRange) {
				alerts.push({
					id: `uni-range-${pos.id}`,
					type: 'out_of_range',
					severity: 'warning',
					title: 'LP Out of Range',
					description: `${uni.token0.symbol}/${uni.token1.symbol} position is out of range and not earning fees.`,
					protocol: 'Uniswap V3',
					value: `$${(uni.valueUSD / 1000).toFixed(2)}K`,
					timestamp: new Date(now.getTime() - i * 120_000),
					read: false,
					actionLabel: 'Rebalance',
					actionHref: '/positions',
				})
			} else if (uni.feesEarned > 100) {
				alerts.push({
					id: `uni-fees-${pos.id}`,
					type: 'fees_earned',
					severity: 'success',
					title: 'Fees Ready to Claim',
					description: `${uni.token0.symbol}/${uni.token1.symbol} has accumulated $${uni.feesEarned.toFixed(2)} in fees.`,
					protocol: 'Uniswap V3',
					value: `+$${uni.feesEarned.toFixed(2)}`,
					timestamp: new Date(now.getTime() - i * 180_000),
					read: false,
					actionLabel: 'Claim Fees',
					actionHref: '/positions',
				})
			}
		}
	})

	// ── Gas low ──
	if (gasGwei > 0 && gasGwei < 15) {
		alerts.push({
			id: `gas-low-${Date.now()}`,
			type: 'gas_low',
			severity: 'info',
			title: 'Low Gas — Good Time to Act',
			description: `Gas is at ${gasGwei} gwei — below average. Good time to rebalance or claim fees.`,
			value: `${gasGwei} gwei`,
			timestamp: new Date(now.getTime() - 300_000),
			read: false,
			actionLabel: 'View Analytics',
			actionHref: '/analytics',
		})
	}

	// ── Price alert ──
	if (Math.abs(ethChange24h) > 5) {
		alerts.push({
			id: `price-eth-${Date.now()}`,
			type: 'price_change',
			severity: ethChange24h > 0 ? 'info' : 'warning',
			title: `ETH ${ethChange24h > 0 ? 'Pumping' : 'Dropping'} ${Math.abs(ethChange24h).toFixed(1)}%`,
			description:
				ethChange24h > 0
					? `ETH up ${ethChange24h.toFixed(1)}% in 24h. Consider taking profit or adjusting LP range.`
					: `ETH down ${Math.abs(ethChange24h).toFixed(1)}% in 24h. Check your Aave health factor.`,
			value: `$${ethPrice.toFixed(0)}`,
			timestamp: new Date(now.getTime() - 600_000),
			read: false,
			actionLabel: 'View Portfolio',
			actionHref: '/portfolio',
		})
	}

	return alerts.sort((a, b) => {
		const order = { critical: 0, warning: 1, info: 2, success: 3 }
		return order[a.severity] - order[b.severity]
	})
}

export function getUnreadCount(alerts: Alert[]) {
	return alerts.filter(a => !a.read).length
}
