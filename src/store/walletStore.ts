import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { formatEth, getEthBalance } from '@/lib/viem'

interface WalletState {
	// Дані гаманця
	address: string | null // Ethereum адреса (0x...)
	chainId: number | null // ID мережі (1 = mainnet, 11155111 = sepolia)
	ethBalance: string | null // Баланс ETH відформатований ('1.2345')
	ethBalanceRaw: bigint | null // Баланс в wei для точних розрахунків
	isConnected: boolean
	isLoadingBalance: boolean

	// Actions
	setWallet: (address: string, chainId: number) => void
	clearWallet: () => void
	fetchBalance: () => Promise<void>
}

export const useWalletStore = create<WalletState>()(
	persist(
		(set, get) => ({
			// Initial state
			address: null,
			chainId: null,
			ethBalance: null,
			ethBalanceRaw: null,
			isConnected: false,
			isLoadingBalance: false,

			// Встановлюємо дані після підключення гаманця
			setWallet: (address, chainId) => {
				set({ address, chainId, isConnected: true })
				// Автоматично завантажуємо баланс після підключення
				get().fetchBalance()
			},

			// Очищаємо при дисконнекті
			clearWallet: () =>
				set({
					address: null,
					chainId: null,
					ethBalance: null,
					ethBalanceRaw: null,
					isConnected: false,
				}),

			// Читаємо баланс з блокчейну через viem
			fetchBalance: async () => {
				const { address } = get()
				if (!address) return

				set({ isLoadingBalance: true })

				try {
					const balanceWei = await getEthBalance(address as `0x${string}`)
					set({
						ethBalanceRaw: balanceWei,
						ethBalance: formatEth(balanceWei),
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
			// Зберігаємо тільки адресу і chainId в localStorage —
			// не зберігаємо баланс бо він може застаріти.
			// bigint не серіалізується в JSON тому ethBalanceRaw теж не зберігаємо.
			partialize: state => ({
				address: state.address,
				chainId: state.chainId,
				isConnected: state.isConnected,
			}),
		},
	),
)
