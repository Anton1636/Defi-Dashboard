import { getUniswapPositions } from './uniswap'
import { getAavePositions } from './aave'
import { getCompoundPositions } from './compound'
import { getTokenPrice } from './coingecko'
import { isProtocolSupported } from '@/lib/chains'
import { mainnet } from 'viem/chains'
import type { Portfolio, DeFiPosition } from '@/types'

const MOCK_PORTFOLIOS: Record<number, Omit<Portfolio, 'walletAddress'>> = {
	[mainnet.id]: {
		totalValueUSD: 24_850.5,
		change24hPercent: 3.24,
		lastUpdated: new Date().toISOString(),
		positions: [
			{
				id: 'uni-1',
				protocol: 'uniswap',
				chainId: mainnet.id,
				walletAddress: '0x0000',
				valueUSD: 12_400,
				poolId: '0xabc123',
				inRange: true,
				feesEarned: 234.5,
				token0: { address: '0x1', symbol: 'ETH', decimals: 18, priceUSD: 3200 },
				token1: { address: '0x2', symbol: 'USDC', decimals: 6, priceUSD: 1 },
			},
			{
				id: 'aave-1',
				protocol: 'aave',
				chainId: mainnet.id,
				walletAddress: '0x0000',
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
				chainId: mainnet.id,
				walletAddress: '0x0000',
				valueUSD: 4_250.5,
				market: 'USDC',
				supplied: 4500,
				borrowed: 0,
				supplyAPR: 2.8,
				borrowAPR: 4.1,
			},
		],
	},
	// Arbitrum mock — без Compound
	42161: {
		totalValueUSD: 8_420.0,
		change24hPercent: -1.2,
		lastUpdated: new Date().toISOString(),
		positions: [
			{
				id: 'uni-arb-1',
				protocol: 'uniswap',
				chainId: 42161,
				walletAddress: '0x0000',
				valueUSD: 5_200,
				poolId: '0xdef456',
				inRange: true,
				feesEarned: 89.2,
				token0: { address: '0x3', symbol: 'ARB', decimals: 18, priceUSD: 1.8 },
				token1: { address: '0x4', symbol: 'USDC', decimals: 6, priceUSD: 1 },
			},
			{
				id: 'aave-arb-1',
				protocol: 'aave',
				chainId: 42161,
				walletAddress: '0x0000',
				valueUSD: 3_220,
				healthFactor: 3.1,
				totalCollateralUSD: 4_000,
				totalDebtUSD: 780,
				netAPY: 2.8,
				supplies: [{ symbol: 'USDC', amount: 4000, valueUSD: 4000, apy: 3.2 }],
				borrows: [{ symbol: 'USDT', amount: 780, valueUSD: 780, apy: 4.1 }],
			},
		],
	},
}

export async function getPortfolio(
	walletAddress: string,
	chainId: number = mainnet.id,
): Promise<Portfolio> {
	if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
		const mockData = MOCK_PORTFOLIOS[chainId] ?? MOCK_PORTFOLIOS[mainnet.id]
		return {
			...mockData,
			walletAddress,
			positions: mockData.positions.map(p => ({
				...p,
				walletAddress,
				chainId,
			})),
		}
	}

	const ethPriceUSD = await getTokenPrice('ETH')

	const [uniswapResult, aaveResult, compoundResult] = await Promise.allSettled([
		isProtocolSupported(chainId, 'uniswap')
			? getUniswapPositions(walletAddress, ethPriceUSD)
			: Promise.resolve([]),
		isProtocolSupported(chainId, 'aave')
			? getAavePositions(walletAddress)
			: Promise.resolve([]),
		isProtocolSupported(chainId, 'compound')
			? getCompoundPositions(walletAddress)
			: Promise.resolve([]),
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
