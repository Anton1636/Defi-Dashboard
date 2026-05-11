'use client'

import { useQuery } from '@tanstack/react-query'
import { useWallet } from './useWallet'
import type { DeFiPosition } from '@/types'

interface PositionsResponse {
	positions: DeFiPosition[]
	count: number
	fetchedAt: string
}

async function fetchPositions(
	walletAddress: string,
	protocol?: string,
): Promise<PositionsResponse> {
	const params = new URLSearchParams({ wallet: walletAddress })
	if (protocol && protocol !== 'all') params.set('protocol', protocol)

	const res = await fetch(`/api/positions?${params}`)
	if (!res.ok) throw new Error(`Positions fetch failed: ${res.status}`)
	return res.json()
}

export function usePositions(protocol?: string) {
	const { address, isConnected } = useWallet()

	return useQuery({
		queryKey: ['positions', address, protocol],
		queryFn: () => fetchPositions(address!, protocol),
		enabled: isConnected && !!address,
		refetchInterval: 60_000,
		staleTime: 30_000,
	})
}
