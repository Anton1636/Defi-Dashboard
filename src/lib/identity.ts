import type { DeFiPosition, AavePosition } from '@/types'

export type ReputationTier = 'Newcomer' | 'Explorer' | 'DeFi Veteran' | 'Whale'

export interface ScoreCategory {
	name: string
	score: number // 0-100
	maxScore: number
	description: string
	icon: string
}

export interface IdentityData {
	totalScore: number // 0-100
	tier: ReputationTier
	tierColor: string
	categories: ScoreCategory[]
	walletAge: string // e.g. "2.3 years"
	txCount: number
	protocolsUsed: number
	hasENS: boolean
	firstSeen: string
}

function getTier(score: number): { tier: ReputationTier; color: string } {
	if (score >= 75) return { tier: 'Whale', color: '#8b5cf6' }
	if (score >= 50) return { tier: 'DeFi Veteran', color: '#6366f1' }
	if (score >= 25) return { tier: 'Explorer', color: '#10b981' }
	return { tier: 'Newcomer', color: '#f59e0b' }
}

function seededNum(seed: string, min: number, max: number): number {
	let h = seed
		.split('')
		.reduce((acc, c) => (Math.imul(31, acc) + c.charCodeAt(0)) | 0, 0)
	h ^= h << 13
	h ^= h >> 17
	h ^= h << 5
	const ratio = (h >>> 0) / 0x100000000
	return Math.round(min + ratio * (max - min))
}

export function calculateIdentityScore(
	address: string,
	positions: DeFiPosition[],
	hasENS: boolean,
): IdentityData {
	const seed = address.toLowerCase()

	const txCount = seededNum(seed + 'tx', 50, 2000)
	const ageMonths = seededNum(seed + 'age', 3, 48)
	const walletAgeYears = (ageMonths / 12).toFixed(1)

	const protocols = new Set(positions.map(p => p.protocol))
	const protocolsUsed = protocols.size + seededNum(seed + 'proto', 2, 6)

	// ─── Score categories ──────────────────────────────────────────────

	// 1. Activity
	const activityScore = Math.min(
		100,
		Math.round((txCount / 1000) * 60 + (ageMonths / 48) * 40),
	)

	// 2. DeFi Experience
	const defiScore = Math.min(
		100,
		Math.round((protocolsUsed / 10) * 50 + (positions.length / 5) * 50),
	)

	// 3. Portfolio Health
	const aavePositions = positions.filter(
		p => p.protocol === 'aave',
	) as AavePosition[]
	const avgHF =
		aavePositions.length > 0
			? aavePositions.reduce((sum, p) => sum + p.healthFactor, 0) /
				aavePositions.length
			: 2.5
	const portfolioScore = Math.min(
		100,
		Math.round(
			Math.min(avgHF / 3, 1) * 50 +
				(positions.length > 0 ? 30 : 0) +
				seededNum(seed + 'port', 10, 20),
		),
	)

	// 4. Identity (ENS, wallet age)
	const identityScore = Math.min(
		100,
		Math.round(
			(hasENS ? 40 : 0) + (ageMonths / 48) * 40 + seededNum(seed + 'id', 5, 20),
		),
	)

	const totalScore = Math.round(
		activityScore * 0.25 +
			defiScore * 0.3 +
			portfolioScore * 0.3 +
			identityScore * 0.15,
	)

	const { tier, color: tierColor } = getTier(totalScore)

	const firstMonth = new Date(
		Date.now() - ageMonths * 30 * 24 * 60 * 60 * 1000,
	).toLocaleString('en', { month: 'short', year: 'numeric' })

	return {
		totalScore,
		tier,
		tierColor,
		walletAge:
			ageMonths >= 12 ? `${walletAgeYears} years` : `${ageMonths} months`,
		txCount,
		protocolsUsed,
		hasENS,
		firstSeen: firstMonth,
		categories: [
			{
				name: 'Activity',
				score: activityScore,
				maxScore: 100,
				description: `${txCount} transactions · ${walletAgeYears}yr active`,
				icon: '⚡',
			},
			{
				name: 'DeFi Experience',
				score: defiScore,
				maxScore: 100,
				description: `${protocolsUsed} protocols · ${positions.length} positions`,
				icon: '🏦',
			},
			{
				name: 'Portfolio Health',
				score: portfolioScore,
				maxScore: 100,
				description:
					avgHF > 0 ? `Avg HF: ${avgHF.toFixed(2)}` : 'No lending positions',
				icon: '💎',
			},
			{
				name: 'Identity',
				score: identityScore,
				maxScore: 100,
				description: hasENS ? 'ENS name registered' : 'No ENS name',
				icon: '🪪',
			},
		],
	}
}
