import type {
	DeFiPosition,
	AavePosition,
	UniswapPosition,
	CompoundPosition,
} from '@/types'

export interface WalletSnapshot {
	address: string
	label?: string
	totalValue: number
	change24h: number
	positions: DeFiPosition[]
	fetchedAt: Date
}

export interface CompareMetric {
	label: string
	a: string | number
	b: string | number
	winner?: 'a' | 'b' | 'tie'
	format: 'usd' | 'pct' | 'count' | 'text' | 'score'
}

function fmt(v: number) {
	if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
	if (v >= 1_000) return `$${(v / 1_000).toFixed(2)}K`
	return `$${v.toFixed(2)}`
}

export function buildCompareMetrics(
	a: WalletSnapshot,
	b: WalletSnapshot,
): CompareMetric[] {
	const aAave = a.positions.find(p => p.protocol === 'aave') as
		| AavePosition
		| undefined
	const bAave = b.positions.find(p => p.protocol === 'aave') as
		| AavePosition
		| undefined
	const aUni = a.positions.find(p => p.protocol === 'uniswap') as
		| UniswapPosition
		| undefined
	const bUni = b.positions.find(p => p.protocol === 'uniswap') as
		| UniswapPosition
		| undefined
	const aComp = a.positions.find(p => p.protocol === 'compound') as
		| CompoundPosition
		| undefined
	const bComp = b.positions.find(p => p.protocol === 'compound') as
		| CompoundPosition
		| undefined

	const aFees = aUni?.feesEarned ?? 0
	const bFees = bUni?.feesEarned ?? 0

	const aHF = aAave?.healthFactor ?? 0
	const bHF = bAave?.healthFactor ?? 0

	const aAPY = Math.max(aAave?.netAPY ?? 0, aComp?.supplyAPR ?? 0)
	const bAPY = Math.max(bAave?.netAPY ?? 0, bComp?.supplyAPR ?? 0)

	// Risk score: lower = safer
	const aRisk = aHF > 0 ? Math.max(0, 10 - aHF * 2) : 5
	const bRisk = bHF > 0 ? Math.max(0, 10 - bHF * 2) : 5

	return [
		{
			label: 'Total Value',
			a: fmt(a.totalValue),
			b: fmt(b.totalValue),
			winner:
				a.totalValue > b.totalValue
					? 'a'
					: b.totalValue > a.totalValue
						? 'b'
						: 'tie',
			format: 'usd',
		},
		{
			label: '24h Change',
			a: `${a.change24h >= 0 ? '+' : ''}${a.change24h.toFixed(2)}%`,
			b: `${b.change24h >= 0 ? '+' : ''}${b.change24h.toFixed(2)}%`,
			winner:
				a.change24h > b.change24h
					? 'a'
					: b.change24h > a.change24h
						? 'b'
						: 'tie',
			format: 'pct',
		},
		{
			label: 'Active Positions',
			a: a.positions.length,
			b: b.positions.length,
			winner:
				a.positions.length > b.positions.length
					? 'a'
					: b.positions.length > a.positions.length
						? 'b'
						: 'tie',
			format: 'count',
		},
		{
			label: 'Best APY',
			a: `${aAPY.toFixed(2)}%`,
			b: `${bAPY.toFixed(2)}%`,
			winner: aAPY > bAPY ? 'a' : bAPY > aAPY ? 'b' : 'tie',
			format: 'pct',
		},
		{
			label: 'Health Factor',
			a: aHF > 0 ? aHF.toFixed(2) : '—',
			b: bHF > 0 ? bHF.toFixed(2) : '—',
			winner: aHF > bHF ? 'a' : bHF > aHF ? 'b' : 'tie',
			format: 'score',
		},
		{
			label: 'LP Fees Earned',
			a: fmt(aFees),
			b: fmt(bFees),
			winner: aFees > bFees ? 'a' : bFees > aFees ? 'b' : 'tie',
			format: 'usd',
		},
		{
			label: 'Risk Score',
			a: `${aRisk.toFixed(1)}/10`,
			b: `${bRisk.toFixed(1)}/10`,
			winner: aRisk < bRisk ? 'a' : bRisk < aRisk ? 'b' : 'tie',
			format: 'score',
		},
		{
			label: 'Protocols Used',
			a: [...new Set(a.positions.map(p => p.protocol))].length,
			b: [...new Set(b.positions.map(p => p.protocol))].length,
			winner: 'tie',
			format: 'count',
		},
	]
}

export function getMockWalletB(baseValue: number): WalletSnapshot {
	return {
		address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
		label: 'vitalik.eth',
		totalValue: baseValue * 1.23,
		change24h: 1.87,
		fetchedAt: new Date(),
		positions: [],
	}
}
