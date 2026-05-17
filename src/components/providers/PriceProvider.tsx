'use client'

import { usePrices } from '@/hooks/usePrices'

export function PriceProvider() {
	usePrices()
	return null
}
