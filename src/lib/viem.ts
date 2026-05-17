import { createPublicClient, http, formatEther, type Chain } from 'viem'

const CHAIN_DEFINITIONS: Record<number, Chain> = {
	1: {
		id: 1,
		name: 'Ethereum',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrls: {
			default: {
				http: [
					`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
				],
			},
		},
	},
	42161: {
		id: 42161,
		name: 'Arbitrum One',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrls: {
			default: {
				http: [
					`https://arbitrum-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
				],
			},
		},
	},
	8453: {
		id: 8453,
		name: 'Base',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrls: {
			default: {
				http: [
					`https://base-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
				],
			},
		},
	},
	10: {
		id: 10,
		name: 'Optimism',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrls: {
			default: {
				http: [
					`https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
				],
			},
		},
	},
	137: {
		id: 137,
		name: 'Polygon',
		nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
		rpcUrls: {
			default: {
				http: [
					`https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
				],
			},
		},
	},
	11155111: {
		id: 11155111,
		name: 'Sepolia',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrls: {
			default: {
				http: [
					`https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
				],
			},
		},
	},
}

const clientCache = new Map<number, ReturnType<typeof createPublicClient>>()

export function getPublicClient(chainId: number) {
	if (!clientCache.has(chainId)) {
		const chain = CHAIN_DEFINITIONS[chainId]
		if (!chain) throw new Error(`Unsupported chain: ${chainId}`)

		clientCache.set(
			chainId,
			createPublicClient({
				chain,
				transport: http(chain.rpcUrls.default.http[0]),
			}),
		)
	}
	return clientCache.get(chainId)!
}

export async function getBalance(
	address: `0x${string}`,
	chainId: number,
): Promise<bigint> {
	return getPublicClient(chainId).getBalance({ address })
}

export function formatBalance(wei: bigint, decimals = 4): string {
	return parseFloat(formatEther(wei)).toFixed(decimals)
}
