import { create } from 'zustand'
import type { DeFiPosition } from '@/types'

interface PositionsState {
	positions: DeFiPosition[]
	totalValueUSD: number
	change24hPercent: number
	isLoading: boolean
	error: string | null
	lastFetched: number | null // Unix timestamp — коли останній раз оновлювались

	// Actions
	setPositions: (positions: DeFiPosition[], totalValue: number) => void
	setLoading: (loading: boolean) => void
	setError: (error: string | null) => void
	clearPositions: () => void

	// Перевіряє чи дані ще свіжі (менше 60 секунд)
	isStale: () => boolean
}

export const usePositionsStore = create<PositionsState>((set, get) => ({
	positions: [],
	totalValueUSD: 0,
	change24hPercent: 0,
	isLoading: false,
	error: null,
	lastFetched: null,

	setPositions: (positions, totalValue) =>
		set({
			positions,
			totalValueUSD: totalValue,
			error: null,
			lastFetched: Date.now(),
		}),

	setLoading: loading => set({ isLoading: loading }),

	setError: error => set({ error, isLoading: false }),

	clearPositions: () =>
		set({
			positions: [],
			totalValueUSD: 0,
			change24hPercent: 0,
			lastFetched: null,
		}),

	// Якщо дані старші 60 секунд — вважаємо їх застарілими
	// і при наступному запиті перезавантажуємо
	isStale: () => {
		const { lastFetched } = get()
		if (!lastFetched) return true
		return Date.now() - lastFetched > 60_000
	},
}))
