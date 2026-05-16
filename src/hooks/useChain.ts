'use client'

import { useEffect } from 'react'
import { useChainId, useSwitchChain } from 'wagmi'
import { useChainStore } from '@/store/chainStore'
import { SUPPORTED_CHAIN_IDS } from '@/lib/chains'

export function useChain() {
	const wagmiChainId = useChainId()
	const { switchChain, isPending: isSwitching } = useSwitchChain()
	const { activeChainId, chainConfig, setActiveChain } = useChainStore()

	useEffect(() => {
		if (
			wagmiChainId &&
			wagmiChainId !== activeChainId &&
			SUPPORTED_CHAIN_IDS.includes(wagmiChainId)
		) {
			setActiveChain(wagmiChainId)
		}
	}, [wagmiChainId, activeChainId, setActiveChain])

	const switchToChain = async (chainId: number) => {
		if (!SUPPORTED_CHAIN_IDS.includes(chainId)) return

		try {
			await switchChain({ chainId })
			setActiveChain(chainId)
		} catch (error) {
			console.error('[useChain] Switch failed:', error)
		}
	}

	return {
		activeChainId,
		chainConfig,
		isSwitching,
		switchToChain,
		isSupported: SUPPORTED_CHAIN_IDS.includes(wagmiChainId),
	}
}
