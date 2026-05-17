import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getChainConfig, type ChainConfig } from '@/lib/chains'

const MAINNET_ID = 1

interface ChainState {
	activeChainId: number
	chainConfig: ChainConfig

	// chainId → totalValueUSD
	portfolioByChain: Record<number, number>

	// Actions
	setActiveChain: (chainId: number) => void
	setPortfolioValue: (chainId: number, value: number) => void
	getTotalPortfolioValue: () => number
}

export const useChainStore = create<ChainState>()(
	persist(
		(set, get) => ({
			activeChainId: MAINNET_ID,
			chainConfig: getChainConfig(MAINNET_ID),
			portfolioByChain: {},

			setActiveChain: chainId => {
				set({
					activeChainId: chainId,
					chainConfig: getChainConfig(chainId),
				})
			},

			setPortfolioValue: (chainId, value) => {
				set(state => ({
					portfolioByChain: {
						...state.portfolioByChain,
						[chainId]: value,
					},
				}))
			},

			getTotalPortfolioValue: () => {
				return Object.values(get().portfolioByChain).reduce(
					(sum, val) => sum + val,
					0,
				)
			},
		}),
		{
			name: 'chain-store',
			partialize: state => ({ activeChainId: state.activeChainId }),
		},
	),
)
