import { create } from 'zustand'
import { priceSocket } from '@/lib/priceSocket'

export interface LivePrice {
	price: number
	change24h: number
	flash: 'up' | 'down' | null
	prevPrice: number | null
}

interface PriceState {
	prices: Record<string, LivePrice>
	isConnected: boolean
	connect: () => () => void
	updatePrice: (symbol: string, price: number, change24h: number) => void
}

export const usePriceStore = create<PriceState>((set, get) => ({
	prices: {},
	isConnected: false,

	connect: () => {
		set({ isConnected: true })

		const unsubscribe = priceSocket.subscribe(
			({ symbol, price, change24h }) => {
				get().updatePrice(symbol, price, change24h)
			},
		)

		return () => {
			unsubscribe()
			set({ isConnected: false })
		}
	},

	updatePrice: (symbol, price, change24h) => {
		set(state => {
			const prev = state.prices[symbol]
			const flash: LivePrice['flash'] =
				prev?.price != null
					? price > prev.price
						? 'up'
						: price < prev.price
							? 'down'
							: null
					: null

			if (flash) {
				setTimeout(() => {
					set(s => ({
						prices: {
							...s.prices,
							[symbol]: s.prices[symbol]
								? { ...s.prices[symbol], flash: null }
								: s.prices[symbol],
						},
					}))
				}, 700)
			}

			return {
				prices: {
					...state.prices,
					[symbol]: {
						price,
						change24h,
						flash,
						prevPrice: prev?.price ?? null,
					},
				},
			}
		})
	},
}))
