import { getUniswapPositions } from './uniswap'
import { getAavePositions } from './aave'
import { getCompoundPositions } from './compound'
import { getTokenPrice } from './coingecko'
import type { Portfolio, DeFiPosition } from '@/types'

export async function getPortfolio(walletAddress: string): Promise<Portfolio> {
	// Отримуємо ціну ETH одним запитом — потрібна для Uniswap розрахунків
	const ethPriceUSD = await getTokenPrice('ETH')

	// Promise.allSettled — запускаємо всі три API паралельно.
	// allSettled (не Promise.all) — якщо один API впав, решта продовжують.
	// Юзер побачить дані з Aave і Compound навіть якщо Uniswap недоступний.
	const [uniswapResult, aaveResult, compoundResult] = await Promise.allSettled([
		getUniswapPositions(walletAddress, ethPriceUSD),
		getAavePositions(walletAddress),
		getCompoundPositions(walletAddress),
	])

	// Витягуємо успішні результати, для помилок повертаємо []
	const uniswapPositions =
		uniswapResult.status === 'fulfilled' ? uniswapResult.value : []
	const aavePositions =
		aaveResult.status === 'fulfilled' ? aaveResult.value : []
	const compoundPositions =
		compoundResult.status === 'fulfilled' ? compoundResult.value : []

	const positions: DeFiPosition[] = [
		...uniswapPositions,
		...aavePositions,
		...compoundPositions,
	]

	// Сумарна вартість всього портфоліо
	const totalValueUSD = positions.reduce((sum, p) => sum + p.valueUSD, 0)

	return {
		walletAddress,
		totalValueUSD,
		change24hPercent: 0, // розрахуємо в Day 9 з PostgreSQL snapshots
		positions,
		lastUpdated: new Date().toISOString(),
	}
}
