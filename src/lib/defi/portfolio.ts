import { getUniswapPositions } from './uniswap'
import { getAavePositions } from './aave'
import { getCompoundPositions } from './compound'
import { getTokenPrice } from './coingecko'
import type { Portfolio, DeFiPosition } from '@/types'

export async function getPortfolio(walletAddress: string): Promise<Portfolio> {
	if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
		return {
			walletAddress,
			totalValueUSD: 24_850.5,
			change24hPercent: 3.24,
			lastUpdated: new Date().toISOString(),
			positions: [
				{
					id: 'uni-1',
					protocol: 'uniswap',
					chainId: 1,
					walletAddress,
					valueUSD: 12_400,
					poolId: '0xabc123',
					inRange: true,
					feesEarned: 234.5,
					token0: {
						address: '0x1',
						symbol: 'ETH',
						decimals: 18,
						priceUSD: 3200,
					},
					token1: { address: '0x2', symbol: 'USDC', decimals: 6, priceUSD: 1 },
				},
				{
					id: 'aave-1',
					protocol: 'aave',
					chainId: 1,
					walletAddress,
					valueUSD: 8_200,
					healthFactor: 2.45,
					totalCollateralUSD: 10_000,
					totalDebtUSD: 1_800,
					netAPY: 3.2,
					supplies: [
						{ symbol: 'USDC', amount: 10000, valueUSD: 10000, apy: 4.5 },
					],
					borrows: [{ symbol: 'DAI', amount: 1800, valueUSD: 1800, apy: 5.2 }],
				},
				{
					id: 'comp-1',
					protocol: 'compound',
					chainId: 1,
					walletAddress,
					valueUSD: 4_250.5,
					market: 'USDC',
					supplied: 4500,
					borrowed: 0,
					supplyAPR: 2.8,
					borrowAPR: 4.1,
				},
			],
		}
	}

	const ethPriceUSD = await getTokenPrice('ETH')

	const [uniswapResult, aaveResult, compoundResult] = await Promise.allSettled([
		getUniswapPositions(walletAddress, ethPriceUSD),
		getAavePositions(walletAddress),
		getCompoundPositions(walletAddress),
	])

	const positions: DeFiPosition[] = [
		...(uniswapResult.status === 'fulfilled' ? uniswapResult.value : []),
		...(aaveResult.status === 'fulfilled' ? aaveResult.value : []),
		...(compoundResult.status === 'fulfilled' ? compoundResult.value : []),
	]

	const totalValueUSD = positions.reduce((sum, p) => sum + p.valueUSD, 0)

	return {
		walletAddress,
		totalValueUSD,
		change24hPercent: 0,
		positions,
		lastUpdated: new Date().toISOString(),
	}
}
