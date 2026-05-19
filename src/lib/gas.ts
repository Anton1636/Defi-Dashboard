import { getPublicClient } from './viem'

export interface GasData {
	slow: number // gwei
	standard: number // gwei
	fast: number // gwei
	baseFee: number // gwei
	level: 'low' | 'normal' | 'high' | 'very-high'
	updatedAt: Date
}

function weiToGwei(wei: bigint): number {
	return Math.round((Number(wei) / 1e9) * 10) / 10
}

function getGasLevel(standardGwei: number): GasData['level'] {
	if (standardGwei < 15) return 'low'
	if (standardGwei < 30) return 'normal'
	if (standardGwei < 60) return 'high'
	return 'very-high'
}

function getMockGasData(): GasData {
	const base = 11 + Math.random() * 8
	return {
		slow: Math.round(base * 10) / 10,
		standard: Math.round(base * 1.3 * 10) / 10,
		fast: Math.round(base * 1.8 * 10) / 10,
		baseFee: Math.round(base * 10) / 10,
		level: getGasLevel(base * 1.3),
		updatedAt: new Date(),
	}
}

export async function fetchGasData(): Promise<GasData> {
	if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
		return getMockGasData()
	}

	try {
		const client = getPublicClient(1) // Mainnet only for gas

		const [gasPrice, feeHistory] = await Promise.allSettled([
			client.getGasPrice(),
			client.estimateFeesPerGas(),
		])

		const gasPriceGwei =
			gasPrice.status === 'fulfilled' ? weiToGwei(gasPrice.value) : 20

		const baseFeeGwei =
			feeHistory.status === 'fulfilled' && feeHistory.value.maxFeePerGas
				? weiToGwei(feeHistory.value.maxFeePerGas)
				: gasPriceGwei

		return {
			slow: Math.round(gasPriceGwei * 0.8 * 10) / 10,
			standard: gasPriceGwei,
			fast: Math.round(gasPriceGwei * 1.5 * 10) / 10,
			baseFee: baseFeeGwei,
			level: getGasLevel(gasPriceGwei),
			updatedAt: new Date(),
		}
	} catch (e) {
		console.warn('[Gas] Failed to fetch, using mock:', e)
		return getMockGasData()
	}
}

export function estimateOpCost(
	gasUnits: number,
	gasPriceGwei: number,
	ethPriceUSD: number,
): number {
	const gasCostEth = (gasUnits * gasPriceGwei) / 1e9
	return gasCostEth * ethPriceUSD
}

export const GAS_UNITS = {
	uniswapSwap: 150_000,
	uniswapAddLiquidity: 300_000,
	uniswapRemoveLiquidity: 250_000,
	aaveSupply: 200_000,
	aaveBorrow: 250_000,
	aaveRepay: 200_000,
	compoundSupply: 150_000,
	compoundWithdraw: 150_000,
	ethTransfer: 21_000,
} as const
