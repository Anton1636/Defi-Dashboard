'use client'

import { useCallback, useState } from 'react'
import type { TokenAllowance } from '@/lib/allowances'

export interface SecurityResult {
	allowanceId: string
	tokenRisk: string[]
	addressRisk: string[]
	approvalRisk: string[]
	overallRisk: 'low' | 'medium' | 'high'
}

export function useSecurityScan() {
	const [results, setResults] = useState<Record<string, SecurityResult>>({})
	const [isScanning, setIsScanning] = useState(false)
	const [walletRisk, setWalletRisk] = useState<string[]>([])
	const [isDone, setIsDone] = useState(false)

	const scanSecurity = useCallback(
		async (walletAddress: string, allowances: TokenAllowance[]) => {
			setIsScanning(true)
			setIsDone(false)

			try {
				const walletRes = await fetch('/api/security', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ type: 'address', address: walletAddress }),
				})
				const walletData = await walletRes.json()
				setWalletRisk(walletData.riskFlags ?? [])

				const scanResults = await Promise.allSettled(
					allowances.map(async (a): Promise<SecurityResult> => {
						const [tokenRes, approvalRes] = await Promise.allSettled([
							fetch('/api/security', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({
									type: 'token',
									address: a.tokenAddress,
									chainId: 1,
								}),
							}).then(r => r.json()),

							fetch('/api/security', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({
									type: 'approval',
									address: a.spenderAddress,
									chainId: 1,
								}),
							}).then(r => r.json()),
						])

						const tokenFlags =
							tokenRes.status === 'fulfilled'
								? (tokenRes.value.riskFlags ?? [])
								: []
						const approvalFlags =
							approvalRes.status === 'fulfilled'
								? (approvalRes.value.riskFlags ?? [])
								: []

						const totalFlags = [...tokenFlags, ...approvalFlags]
						const overallRisk: 'low' | 'medium' | 'high' =
							totalFlags.length === 0
								? 'low'
								: totalFlags.some(
											f =>
												f.includes('Honeypot') ||
												f.includes('Malicious') ||
												f.includes('Phishing'),
									  )
									? 'high'
									: 'medium'

						return {
							allowanceId: a.id,
							tokenRisk: tokenFlags,
							addressRisk: [],
							approvalRisk: approvalFlags,
							overallRisk,
						}
					}),
				)

				const newResults: Record<string, SecurityResult> = {}
				scanResults.forEach((r, i) => {
					if (r.status === 'fulfilled') {
						newResults[allowances[i].id] = r.value
					}
				})
				setResults(newResults)
			} catch (e) {
				console.error('[useSecurityScan]', e)
			} finally {
				setIsScanning(false)
				setIsDone(true)
			}
		},
		[],
	)

	return { results, isScanning, walletRisk, isDone, scanSecurity }
}
