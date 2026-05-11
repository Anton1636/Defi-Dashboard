'use client'

import { useEffect } from 'react'
import { useAccount, useChainId, useDisconnect } from 'wagmi'
import { useWalletStore } from '@/store/walletStore'

// useWallet — об'єднує wagmi хуки і Zustand store.
// wagmi дає реактивні дані про підключений гаманець.
// Zustand зберігає ці дані глобально і додає баланс.
export function useWallet() {
	const { address, isConnected } = useAccount()
	const chainId = useChainId()
	const { disconnect } = useDisconnect()

	const { setWallet, clearWallet, ethBalance, isLoadingBalance, fetchBalance } =
		useWalletStore()

	// Синхронізуємо wagmi стан з Zustand store
	useEffect(() => {
		if (isConnected && address) {
			// Гаманець підключений — оновлюємо store
			setWallet(address, chainId)
		} else {
			// Гаманець відключений — очищаємо store
			clearWallet()
		}
	}, [isConnected, address, chainId, setWallet, clearWallet])

	return {
		address,
		chainId,
		isConnected,
		ethBalance,
		isLoadingBalance,
		disconnect,
		refreshBalance: fetchBalance,
	}
}
