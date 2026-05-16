'use client'

import { useQuery } from '@tanstack/react-query'
import { useWallet } from './useWallet'
import { useChainStore } from '@/store/chainStore'
import type { Portfolio } from '@/types'

async function fetchPortfolio(
	walletAddress: string,
	chainId: number,
): Promise<Portfolio> {
	const res = await fetch(
		`/api/portfolio?wallet=${walletAddress}&chainId=${chainId}`,
	)
	if (!res.ok) throw new Error(`Portfolio fetch failed: ${res.status}`)
	return res.json()
}

export function usePortfolio() {
	const { address, isConnected } = useWallet()
	const { activeChainId } = useChainStore()

	return useQuery({
		queryKey: ['portfolio', address, activeChainId],
		queryFn: () => fetchPortfolio(address!, activeChainId),
		enabled: isConnected && !!address,
		refetchInterval: 2 * 60_000,
		staleTime: 60_000,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	})
}
