'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchGasData, type GasData } from '@/lib/gas'

const REFRESH_INTERVAL = 15_000

export function useGas() {
	const [data, setData] = useState<GasData | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

	const refresh = useCallback(() => {
		fetchGasData()
			.then(gas => {
				setData(gas)
				setLastRefresh(new Date())
				setIsLoading(false)
			})
			.catch(e => {
				console.error('[useGas]', e)
				setIsLoading(false)
			})
	}, [])

	useEffect(() => {
		refresh()
		const interval = setInterval(refresh, REFRESH_INTERVAL)
		return () => clearInterval(interval)
	}, [refresh])

	return { data, isLoading, refresh, lastRefresh }
}
