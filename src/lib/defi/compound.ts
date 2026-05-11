import type { CompoundPosition } from '@/types'

// Compound V3 (Comet) REST API
// Документація: https://v3-api.compound.finance
const COMPOUND_API = 'https://v3-api.compound.finance'

interface CompoundUserData {
	account: string
	markets: CompoundMarket[]
}

interface CompoundMarket {
	cometProxy: string
	baseAsset: {
		symbol: string
		priceUsd: string
	}
	supplyBalance: string // скільки задепоновано
	borrowBalance: string // скільки позичено
	supplyApr: string // APR на депозит (у відсотках)
	borrowApr: string // APR на позику
	collaterals: CompoundCollateral[]
}

interface CompoundCollateral {
	asset: { symbol: string }
	balance: string
	balanceUsd: string
}

export async function getCompoundPositions(
	walletAddress: string,
): Promise<CompoundPosition[]> {
	try {
		const response = await fetch(
			`${COMPOUND_API}/account?address=${walletAddress}&chain_id=1`,
			{ next: { revalidate: 30 } },
		)

		if (!response.ok) {
			if (response.status === 404) return []
			throw new Error(`Compound API error: ${response.status}`)
		}

		const data: CompoundUserData = await response.json()

		// Фільтруємо тільки активні ринки (з балансом)
		const activeMarkets = data.markets.filter(
			m => parseFloat(m.supplyBalance) > 0 || parseFloat(m.borrowBalance) > 0,
		)

		if (activeMarkets.length === 0) return []

		return activeMarkets.map(market => {
			const supplied = parseFloat(market.supplyBalance)
			const borrowed = parseFloat(market.borrowBalance)
			const priceUSD = parseFloat(market.baseAsset.priceUsd)

			// Загальна вартість позиції = депозит - борг (в USD)
			const valueUSD = (supplied - borrowed) * priceUSD

			return {
				protocol: 'compound' as const,
				chainId: 1,
				walletAddress,
				id: `compound-${market.cometProxy}`,
				valueUSD,
				market: market.baseAsset.symbol,
				supplied,
				borrowed,
				supplyAPR: parseFloat(market.supplyApr),
				borrowAPR: parseFloat(market.borrowApr),
			}
		})
	} catch (error) {
		console.error('[Compound] Failed to fetch positions:', error)
		return []
	}
}
