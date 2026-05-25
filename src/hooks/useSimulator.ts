'use client'

import { useCallback, useState } from 'react'
import { useGas } from './useGas'
import { usePriceStore } from '@/store/priceStore'

export type SimType =
	| 'eth-transfer'
	| 'erc20-transfer'
	| 'uniswap-swap'
	| 'aave-supply'
	| 'aave-repay'
	| 'compound-supply'

export interface SimResult {
	success: boolean
	gasUsed: number
	gasCostUSD: number
	errorMessage: string | null
	blockNumber: number
	expectedOutput: string
	priceImpact: string | null
	logs: { name: string; inputs: { name: string; value: string }[] }[]
}

export function useSimulator() {
	const [result, setResult] = useState<SimResult | null>(null)
	const [isSimulating, setIsSimulating] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const { data: gas } = useGas()
	const ethPrice = usePriceStore(s => s.prices['ETH']?.price ?? 3245)

	const simulate = useCallback(
		(type: SimType, amount: number, walletAddress: string) => {
			setIsSimulating(true)
			setError(null)
			setResult(null)

			fetch('/api/simulate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type,
					amount,
					walletAddress,
					gasGwei: gas?.standard ?? 20,
					ethPrice,
				}),
			})
				.then(r => r.json())
				.then(data => {
					if (data.error) {
						setError(data.error)
					} else {
						setResult(data)
					}
				})
				.catch(err => setError(err.message))
				.finally(() => setIsSimulating(false))
		},
		[gas, ethPrice],
	)

	const reset = useCallback(() => {
		setResult(null)
		setError(null)
	}, [])

	return { result, isSimulating, error, simulate, reset }
}
