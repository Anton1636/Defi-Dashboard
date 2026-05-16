import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getBalance, formatBalance } from '@/lib/viem'

interface WalletState {
	address: string | null
	chainId: number | null
	ethBalance: string | null
	ethBalanceRaw: bigint | null
	isConnected: boolean
	isLoadingBalance: boolean

	setWallet: (address: string, chainId: number) => void
	clearWallet: () => void
	fetchBalance: (chainId?: number) => Promise<void>
}

export const useWalletStore = create<WalletState>()(
	persist(
		(set, get) => ({
			address: null,
			chainId: null,
			ethBalance: null,
			ethBalanceRaw: null,
			isConnected: false,
			isLoadingBalance: false,

			setWallet: (address, chainId) => {
				set({ address, chainId, isConnected: true })
				get().fetchBalance(chainId)
			},

			clearWallet: () =>
				set({
					address: null,
					chainId: null,
					ethBalance: null,
					ethBalanceRaw: null,
					isConnected: false,
				}),

			fetchBalance: async (chainId?: number) => {
				const { address, chainId: storedChainId } = get()
				if (!address) return

				const targetChainId = chainId ?? storedChainId ?? 1
				set({ isLoadingBalance: true })

				try {
					const balanceWei = await getBalance(
						address as `0x${string}`,
						targetChainId,
					)
					set({
						ethBalanceRaw: balanceWei,
						ethBalance: formatBalance(balanceWei),
					})
				} catch (error) {
					console.error('[WalletStore] Failed to fetch balance:', error)
				} finally {
					set({ isLoadingBalance: false })
				}
			},
		}),
		{
			name: 'wallet-store',
			partialize: state => ({
				address: state.address,
				chainId: state.chainId,
				isConnected: state.isConnected,
			}),
		},
	),
)
