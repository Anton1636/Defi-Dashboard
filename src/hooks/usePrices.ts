'use client'

import { useEffect } from 'react'
import { usePriceStore } from '@/store/priceStore'

export function usePrices() {
	const { prices, connect, isConnected } = usePriceStore()

	useEffect(() => {
		const disconnect = connect()
		return disconnect
	}, [connect])

	return { prices, isConnected }
}

export function useTokenPrice(symbol: string) {
	const prices = usePriceStore(s => s.prices)
	return prices[symbol.toUpperCase()] ?? null
}
