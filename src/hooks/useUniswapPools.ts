'use client'

import { useState, useEffect, useCallback } from 'react'

export interface UniswapPool {
	id: string
	token0: string
	token1: string
	feeTier: string
	tvl: number
	volume24h: number
	pair: string
	chain: string
	dex: string
}

const BASE = 'https://api.geckoterminal.com/api/v2'

const NETWORKS = [
	{ id: 'eth', label: 'Ethereum', dex: 'uniswap_v3' },
	{ id: 'arbitrum', label: 'Arbitrum', dex: 'uniswap_v3' },
	{ id: 'base', label: 'Base', dex: 'uniswap_v3' },
	{ id: 'polygon_pos', label: 'Polygon', dex: 'uniswap_v3' },
	{ id: 'solana', label: 'Solana', dex: 'orca' },
	{ id: 'bsc', label: 'BSC', dex: 'pancakeswap_v3' },
]

function parsePool(
	item: {
		id: string
		attributes: {
			name: string
			base_token_price_usd: string
			quote_token_price_usd: string
			reserve_in_usd: string
			volume_usd: { h24: string }
			swap_count_24h: number
			fee_tier?: string
		}
		relationships: {
			base_token: { data: { id: string } }
			quote_token: { data: { id: string } }
			dex?: { data: { id: string } }
		}
	},
	chain: string,
	dex: string,
): UniswapPool {
	const name = item.attributes.name ?? ''
	const parts = name.split(' / ')
	const token0 = parts[0]?.trim().split(' ')[0] ?? '???'
	const token1 = parts[1]?.trim().split(' ')[0] ?? '???'
	const fee = item.attributes.fee_tier
		? `${(Number(item.attributes.fee_tier) / 10000).toFixed(2)}%`
		: '0.3%'

	return {
		id: item.id,
		token0,
		token1,
		feeTier: fee,
		tvl: parseFloat(item.attributes.reserve_in_usd ?? '0'),
		volume24h: parseFloat(item.attributes.volume_usd?.h24 ?? '0'),
		pair: `${token0}/${token1}`,
		chain,
		dex: item.relationships.dex?.data?.id ?? dex,
	}
}

async function fetchTopPools(
	networkId: string,
	networkLabel: string,
	dex: string,
): Promise<UniswapPool[]> {
	const url = `${BASE}/networks/${networkId}/dexes/${dex}/pools?page=1&include=base_token,quote_token`
	const res = await fetch(url, {
		headers: { Accept: 'application/json;version=20230302' },
		signal: AbortSignal.timeout(6000),
	})
	if (!res.ok) throw new Error(`${res.status}`)
	const json = await res.json()
	return (json.data ?? [])
		.slice(0, 5)
		.map((item: Parameters<typeof parsePool>[0]) =>
			parsePool(item, networkLabel, dex),
		)
}

async function searchPools(
	query: string,
	networkId?: string,
): Promise<UniswapPool[]> {
	const url = networkId
		? `${BASE}/search/pools?query=${encodeURIComponent(query)}&network=${networkId}`
		: `${BASE}/search/pools?query=${encodeURIComponent(query)}`

	const res = await fetch(url, {
		headers: { Accept: 'application/json;version=20230302' },
		signal: AbortSignal.timeout(8000),
	})
	if (!res.ok) throw new Error(`${res.status}`)
	const json = await res.json()

	return (json.data ?? [])
		.slice(0, 20)
		.map((item: Parameters<typeof parsePool>[0]) => {
			const networkFromId = item.id.split('_')[0] ?? 'unknown'
			const net = NETWORKS.find(n => n.id === networkFromId)
			return parsePool(item, net?.label ?? networkFromId, net?.dex ?? 'unknown')
		})
}

export function useUniswapPools() {
	const [pools, setPools] = useState<UniswapPool[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isSearching, setIsSearching] = useState(false)
	const [source, setSource] = useState<'api' | 'fallback'>('fallback')
	const [searchError, setSearchError] = useState('')

	// Load top 20 on mount
	useEffect(() => {
		async function load() {
			setIsLoading(true)
			const results: UniswapPool[] = []

			await Promise.allSettled(
				NETWORKS.map(async net => {
					try {
						const data = await fetchTopPools(net.id, net.label, net.dex)
						results.push(...data)
					} catch (e) {
						console.warn(`[Pools] ${net.label} failed:`, e)
					}
				}),
			)

			// Sort by TVL, deduplicate by pair+chain
			const seen = new Set<string>()
			const dedup = results
				.sort((a, b) => b.tvl - a.tvl)
				.filter(p => {
					const key = `${p.chain}-${p.pair}-${p.feeTier}`
					if (seen.has(key)) return false
					seen.add(key)
					return true
				})

			setPools(dedup)
			setSource(dedup.length > 0 ? 'api' : 'fallback')
			setIsLoading(false)
		}
		load()
	}, [])

	// Search by query — called when not found in initial 20
	const search = useCallback(async (query: string) => {
		if (!query.trim()) return
		setIsSearching(true)
		setSearchError('')

		try {
			const results = await searchPools(query.trim())
			if (results.length === 0) {
				setSearchError(`No pools found for "${query}"`)
				return
			}
			// Merge with existing, put search results first
			setPools(prev => {
				return [
					...results,
					...prev.filter(p => !results.find(r => r.id === p.id)),
				]
			})
		} catch {
			setSearchError('Search failed. Check your connection.')
		} finally {
			setIsSearching(false)
		}
	}, [])

	return { pools, isLoading, isSearching, source, searchError, search }
}
