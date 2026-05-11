'use client'

import { useQuery } from '@tanstack/react-query'
import { useWallet } from './useWallet'
import type { Portfolio } from '@/types'

// Fetch portfolio
async function fetchPortfolio(walletAddress: string): Promise<Portfolio> {
	const res = await fetch(`/api/portfolio?wallet=${walletAddress}`)

	if (!res.ok) {
		throw new Error(`Portfolio fetch failed: ${res.status}`)
	}

	return res.json()
}

export function usePortfolio() {
	const { address, isConnected } = useWallet()

	return useQuery({
		// If address changes — automatically makes a new request.
		queryKey: ['portfolio', address],

		queryFn: () => fetchPortfolio(address!),

		// Request only if the wallet is connected
		enabled: isConnected && !!address,

		// Refetch every 60 seconds — DeFi data changes frequently
		refetchInterval: 60_000,

		// staleTime: 30 seconds — not making unnecessary requests during navigation
		staleTime: 30_000,
	})
}
