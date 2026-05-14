'use client'

import { useCallback } from 'react'
import { useWallet } from './useWallet'
import { useAIStore } from '@/store/aiStore'

export function useAI() {
	const { address } = useWallet()
	const {
		streamingText,
		isStreaming,
		history,
		isLoadingHistory,
		error,
		startStreaming,
		appendStreamChunk,
		finishStreaming,
		setHistory,
		setLoadingHistory,
		setError,
		clearStreaming,
	} = useAIStore()

	const analyze = useCallback(
		async (question?: string) => {
			if (!address || isStreaming) return

			startStreaming()

			try {
				const response = await fetch('/api/ai', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						walletAddress: address,
						question,
					}),
				})

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`)
				}

				if (!response.body) {
					throw new Error('No response body')
				}

				const reader = response.body.getReader()
				const decoder = new TextDecoder()

				while (true) {
					const { done, value } = await reader.read()
					if (done) break

					const text = decoder.decode(value)
					const lines = text.split('\n')

					for (const line of lines) {
						if (!line.startsWith('data: ')) continue

						try {
							const data = JSON.parse(line.slice(6))

							if (data.error) {
								throw new Error(data.error)
							}

							if (data.done) {
								finishStreaming()
								fetchHistory()
								break
							}

							if (data.text) {
								appendStreamChunk(data.text)
							}
						} catch (parseError) {
							console.warn('[useAI] Parse error:', parseError)
						}
					}
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Analysis failed')
			}
		},
		[address, isStreaming],
	)

	const fetchHistory = useCallback(async () => {
		setLoadingHistory(true)
		try {
			const res = await fetch('/api/ai?limit=10')
			if (!res.ok) throw new Error('Failed to fetch history')
			const data = await res.json()
			setHistory(data.analyses ?? [])
		} catch (err) {
			console.error('[useAI] History fetch error:', err)
			setLoadingHistory(false)
		}
	}, [])

	return {
		analyze,
		fetchHistory,
		clearStreaming,
		streamingText,
		isStreaming,
		history,
		isLoadingHistory,
		error,
		canAnalyze: !!address && !isStreaming,
	}
}
