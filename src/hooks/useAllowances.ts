'use client'

import { useCallback, useState } from 'react'
import {
	fetchAllowances,
	type TokenAllowance,
	type AllowanceSummary,
} from '@/lib/allowances'

export function useAllowances() {
	const [allowances, setAllowances] = useState<TokenAllowance[]>([])
	const [summary, setSummary] = useState<AllowanceSummary | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [isScanned, setIsScanned] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const scan = useCallback((address: string) => {
		setIsLoading(true)
		setError(null)

		fetchAllowances(address)
			.then(result => {
				setAllowances(result.allowances)
				setSummary(result.summary)
				setIsScanned(true)
				setIsLoading(false)
			})
			.catch(err => {
				setError(err.message ?? 'Scan failed')
				setIsLoading(false)
			})
	}, [])

	return { allowances, summary, isLoading, isScanned, error, scan }
}
