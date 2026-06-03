'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { usePortfolio } from './usePortfolio'
import { useGas } from './useGas'
import { usePriceStore } from '@/store/priceStore'
import { generateAlerts, type Alert } from '@/lib/alertEngine'

const POLL_INTERVAL = 30_000

export function useAlerts() {
	const [alerts, setAlerts] = useState<Alert[]>([])
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
	const readIds = useRef<Set<string>>(new Set())

	const { data: portfolio } = usePortfolio()
	const { data: gas } = useGas()
	const prices = usePriceStore(s => s.prices)

	const refresh = useCallback(() => {
		const positions = portfolio?.positions ?? []
		const gasGwei = gas?.standard ?? 0
		const ethPrice = prices.ETH?.price ?? 0
		const ethChange = prices.ETH?.change24h ?? 0

		const fresh = generateAlerts({
			positions,
			gasGwei,
			ethPrice,
			ethChange24h: ethChange,
		})
		// Restore read state
		const withRead = fresh.map(a => ({ ...a, read: readIds.current.has(a.id) }))
		setAlerts(withRead)
		setLastUpdated(new Date())
	}, [portfolio, gas, prices])

	// Initial + polling
	useEffect(() => {
		refresh()
		const timer = setInterval(refresh, POLL_INTERVAL)
		return () => clearInterval(timer)
	}, [refresh])

	const markRead = useCallback((id: string) => {
		readIds.current.add(id)
		setAlerts(prev => prev.map(a => (a.id === id ? { ...a, read: true } : a)))
	}, [])

	const markAllRead = useCallback(() => {
		alerts.forEach(a => readIds.current.add(a.id))
		setAlerts(prev => prev.map(a => ({ ...a, read: true })))
	}, [alerts])

	const unreadCount = alerts.filter(a => !a.read).length

	return { alerts, unreadCount, lastUpdated, markRead, markAllRead, refresh }
}
