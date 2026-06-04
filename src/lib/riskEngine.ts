import type {
	DeFiPosition,
	AavePosition,
	UniswapPosition,
	CompoundPosition,
} from '@/types'

export type RiskLevel = 'safe' | 'moderate' | 'high' | 'critical'

export interface RiskNode {
	id: string
	protocol: string
	label: string
	icon: string
	valueUSD: number
	riskScore: number // 0-10
	riskLevel: RiskLevel
	riskFactors: string[]
	x: number // 0-100 (exposure axis)
	y: number // 0-100 (risk axis)
	color: string
}

export interface RiskSummary {
	totalScore: number
	level: RiskLevel
	nodes: RiskNode[]
	topRisk: string
	suggestion: string
}

const PROTOCOL_COLORS: Record<string, string> = {
	uniswap: '#ff007a',
	aave: '#7b61ff',
	compound: '#00d395',
}

const PROTOCOL_ICONS: Record<string, string> = {
	uniswap: '🦄',
	aave: '👻',
	compound: '🏦',
}

function getRiskLevel(score: number): RiskLevel {
	if (score >= 7.5) return 'critical'
	if (score >= 5) return 'high'
	if (score >= 2.5) return 'moderate'
	return 'safe'
}

export function calcRisk(
	positions: DeFiPosition[],
	totalValue: number,
): RiskSummary {
	const nodes: RiskNode[] = []

	positions.forEach((pos, i) => {
		const exposurePct = totalValue > 0 ? (pos.valueUSD / totalValue) * 100 : 0
		let riskScore = 0
		const riskFactors: string[] = []

		if (pos.protocol === 'aave') {
			const aave = pos as AavePosition
			// HF risk: below 1.5 = critical
			if (aave.healthFactor < 1.2) {
				riskScore += 8
				riskFactors.push('Critical HF')
			} else if (aave.healthFactor < 1.5) {
				riskScore += 5
				riskFactors.push('Low HF')
			} else if (aave.healthFactor < 2) {
				riskScore += 2
				riskFactors.push('Watch HF')
			}
			// Borrow risk
			if (aave.totalDebtUSD > 0) {
				riskScore += 1.5
				riskFactors.push('Active borrow')
			}
			// Concentration risk
			if (exposurePct > 40) {
				riskScore += 1
				riskFactors.push('High concentration')
			}
		}

		if (pos.protocol === 'uniswap') {
			const uni = pos as UniswapPosition
			// IL risk
			riskScore += 2.5
			riskFactors.push('IL exposure')
			// Out of range
			if (!uni.inRange) {
				riskScore += 3
				riskFactors.push('Out of range')
			}
			// Concentration
			if (exposurePct > 50) {
				riskScore += 1
				riskFactors.push('High concentration')
			}
		}

		if (pos.protocol === 'compound') {
			const comp = pos as CompoundPosition
			// Supply only = low risk
			riskScore += 1
			riskFactors.push('Supply risk')
			if (comp.borrowed > 0) {
				riskScore += 2
				riskFactors.push('Active borrow')
			}
		}

		// Cap at 10
		riskScore = Math.min(10, Math.round(riskScore * 10) / 10)

		// Position on 2D map
		// X = exposure size (0-100)
		// Y = risk level (0-100), higher = more risk
		const x = Math.min(95, exposurePct * 1.2 + 5)
		const y = Math.min(95, riskScore * 9 + 5)

		nodes.push({
			id: pos.id,
			protocol: pos.protocol,
			label: `${pos.protocol.charAt(0).toUpperCase() + pos.protocol.slice(1)} V3`,
			icon: PROTOCOL_ICONS[pos.protocol] ?? '⬡',
			valueUSD: pos.valueUSD,
			riskScore,
			riskLevel: getRiskLevel(riskScore),
			riskFactors,
			x,
			y: Math.min(88, Math.max(8, 100 - y)),
			color: PROTOCOL_COLORS[pos.protocol] ?? '#888',
		})
	})

	const avgScore = nodes.length
		? nodes.reduce((s, n) => s + n.riskScore, 0) / nodes.length
		: 0

	const topRiskNode = [...nodes].sort((a, b) => b.riskScore - a.riskScore)[0]
	const topRisk = topRiskNode
		? `${topRiskNode.label}: ${topRiskNode.riskFactors[0] ?? 'Monitor'}`
		: 'No positions'

	const suggestion =
		avgScore < 2.5
			? 'Portfolio is well-diversified with low risk. Consider adding yield.'
			: avgScore < 5
				? 'Moderate risk profile. Monitor Aave health factor regularly.'
				: avgScore < 7.5
					? 'Elevated risk detected. Review your positions and consider reducing exposure.'
					: 'High risk! Immediate action recommended to avoid liquidation.'

	return {
		totalScore: Math.round(avgScore * 10) / 10,
		level: getRiskLevel(avgScore),
		nodes,
		topRisk,
		suggestion,
	}
}
