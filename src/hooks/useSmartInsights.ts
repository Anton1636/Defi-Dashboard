'use client'

import { useEffect, useRef } from 'react'
import { useAIStore } from '@/store/aiStore'
import { useWallet } from './useWallet'
import type { DeFiPosition } from '@/types'

const COOLDOWN_MS = 5 * 60 * 1000
const STORAGE_KEY = 'defi-last-smart-insight'

const MOCK_INSIGHT =
	'Your Uniswap ETH/USDC position is in range and earning fees — no action needed. ' +
	'Monitor your Aave health factor (2.45) and consider adding collateral if ETH drops below $2,800.'

function getCooldownPassed(): boolean {
	try {
		const last = localStorage.getItem(STORAGE_KEY)
		if (!last) return true
		return Date.now() - parseInt(last) > COOLDOWN_MS
	} catch {
		return true
	}
}

function setCooldown() {
	try {
		localStorage.setItem(STORAGE_KEY, Date.now().toString())
	} catch {}
}

export function useSmartInsights(
	positions: DeFiPosition[],
	totalValueUSD: number,
) {
	const { address } = useWallet()
	const hasRun = useRef(false)

	const storeRef = useRef(useAIStore.getState())
	useEffect(() => {
		return useAIStore.subscribe(state => {
			storeRef.current = state
		})
	}, [])

	useEffect(() => {
		if (!address) return
		if (positions.length === 0) return
		if (hasRun.current) return
		if (!getCooldownPassed()) return

		const { isAutoAnalyzing, latestInsight } = storeRef.current
		if (isAutoAnalyzing || latestInsight) return

		hasRun.current = true
		setCooldown()

		console.log('[SmartInsights] Starting mock analysis...')
		storeRef.current.startAutoAnalyzing()

		let i = 0
		const interval = setInterval(() => {
			if (i < MOCK_INSIGHT.length) {
				storeRef.current.appendAutoChunk(MOCK_INSIGHT[i])
				i++
			} else {
				console.log('[SmartInsights] Mock analysis complete!')
				clearInterval(interval)
				storeRef.current.finishAutoAnalyzing()
			}
		}, 18)

		return () => clearInterval(interval)
	}, [address, positions.length, totalValueUSD])
}
