import { createPublicClient, http, formatEther } from 'viem'
import {
	mainnet,
	arbitrum,
	base,
	optimism,
	polygon,
	sepolia,
} from 'viem/chains'
import type { Chain } from 'viem'
import { CHAINS } from './chains'

export function createChainClient(chainId: number) {
	const chainConfig = CHAINS[chainId]
	if (!chainConfig) throw new Error(`Unsupported chain: ${chainId}`)

	const VIEM_CHAINS: Record<number, Chain> = {
		[mainnet.id]: mainnet,
		[arbitrum.id]: arbitrum,
		[base.id]: base,
		[optimism.id]: optimism,
		[polygon.id]: polygon,
		[sepolia.id]: sepolia,
	}

	const chain = VIEM_CHAINS[chainId]
	if (!chain) throw new Error(`No viem chain for chainId: ${chainId}`)

	return createPublicClient({
		chain,
		transport: http(chainConfig.rpcUrl),
	})
}

const clientCache = new Map<number, ReturnType<typeof createPublicClient>>()

export function getPublicClient(chainId: number) {
	if (!clientCache.has(chainId)) {
		clientCache.set(chainId, createChainClient(chainId))
	}
	return clientCache.get(chainId)!
}

export async function getBalance(
	address: `0x${string}`,
	chainId: number,
): Promise<bigint> {
	const client = getPublicClient(chainId)
	return client.getBalance({ address })
}

export function formatBalance(wei: bigint, decimals = 4): string {
	const eth = parseFloat(formatEther(wei))
	return eth.toFixed(decimals)
}
