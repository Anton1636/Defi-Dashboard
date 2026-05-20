'use client'

import { useMemo } from 'react'
import { calculateIdentityScore } from '@/lib/identity'
import { useWallet } from './useWallet'
import { useENS } from './useENS'
import { usePortfolio } from './usePortfolio'

export function useIdentity() {
	const { address } = useWallet()
	const { name: ensName } = useENS(address)
	const { data: portfolio } = usePortfolio()

	const identity = useMemo(() => {
		if (!address) return null
		return calculateIdentityScore(
			address,
			portfolio?.positions ?? [],
			!!ensName,
		)
	}, [address, portfolio?.positions, ensName])

	return { identity, ensName, address }
}
