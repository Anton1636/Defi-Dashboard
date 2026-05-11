import { createPublicClient, createWalletClient, http, custom } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

export const publicClient = createPublicClient({
	chain: mainnet,
	transport: http(
		`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
	),
})

export const sepoliaClient = createPublicClient({
	chain: sepolia,
	transport: http(
		`https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
	),
})

export async function getWalletClient() {
	if (typeof window === 'undefined' || !window.ethereum) {
		throw new Error('No wallet found')
	}

	return createWalletClient({
		chain: mainnet,
		transport: custom(window.ethereum),
	})
}

export async function getEthBalance(address: `0x${string}`): Promise<bigint> {
	return publicClient.getBalance({ address })
}

export function formatEth(wei: bigint, decimals = 4): string {
	const eth = Number(wei) / 1e18
	return eth.toFixed(decimals)
}
