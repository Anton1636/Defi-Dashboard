'use client'

import { useState, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useUniswapPools } from '@/hooks/useUniswapPools'

const LiquidityHeatMap = dynamic(
	() =>
		import('@/components/charts/LiquidityHeatMap').then(
			m => m.LiquidityHeatMap,
		),
	{ ssr: false },
)

const CHAIN_COLORS: Record<string, string> = {
	Ethereum: '#627eea',
	Arbitrum: '#28a0f0',
	Base: '#0052ff',
	Polygon: '#8247e5',
	Solana: '#9945ff',
	BSC: '#f3ba2f',
}

function fmtTVL(v: number) {
	if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`
	if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(0)}M`
	if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`
	return `$${v.toFixed(0)}`
}

export default function LiquidityPage() {
	const { pools, isLoading, isSearching, source, searchError, search } =
		useUniswapPools()
	const [selectedIdx, setSelectedIdx] = useState(0)
	const [query, setQuery] = useState('')
	const [selectedChain, setSelectedChain] = useState('All')
	const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

	// Filter by chain + search query locally first
	const filtered = useMemo(() => {
		let result =
			selectedChain === 'All'
				? pools
				: pools.filter(p => p.chain === selectedChain)

		if (query.trim()) {
			result = result.filter(
				p =>
					p.pair.toLowerCase().includes(query.toLowerCase()) ||
					p.token0.toLowerCase().includes(query.toLowerCase()) ||
					p.token1.toLowerCase().includes(query.toLowerCase()),
			)
		}
		return result
	}, [pools, query, selectedChain])

	const selected = filtered[selectedIdx] ?? filtered[0] ?? pools[0]

	// When local filter returns 0 results — call API search
	const handleQueryChange = (val: string) => {
		setQuery(val)
		setSelectedIdx(0)
		if (searchTimeout.current) clearTimeout(searchTimeout.current)
		if (val.length >= 2) {
			searchTimeout.current = setTimeout(() => {
				// Only search API if nothing found locally
				const local = pools.filter(
					p =>
						p.pair.toLowerCase().includes(val.toLowerCase()) ||
						p.token0.toLowerCase().includes(val.toLowerCase()) ||
						p.token1.toLowerCase().includes(val.toLowerCase()),
				)
				if (local.length === 0) {
					search(val)
				}
			}, 600)
		}
	}

	const allChains = ['All', ...Array.from(new Set(pools.map(p => p.chain)))]

	return (
		<div
			style={{
				height: 'calc(100vh - 84px)',
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
			}}
		>
			{/* Header */}
			<div
				style={{
					padding: '14px 20px 10px',
					borderBottom: '1px solid var(--border-1)',
					flexShrink: 0,
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginBottom: 10,
						flexWrap: 'wrap',
						gap: 8,
					}}
				>
					<div>
						<h1
							style={{
								fontSize: 20,
								fontWeight: 900,
								color: 'var(--text-primary)',
								letterSpacing: '-.8px',
								marginBottom: 2,
							}}
						>
							🌡 Liquidity Heat Map
						</h1>
						<p
							style={{
								fontSize: 11,
								color: 'var(--text-tertiary)',
								display: 'flex',
								alignItems: 'center',
								gap: 6,
							}}
						>
							See where liquidity is concentrated · optimize your LP range
							<span
								style={{
									fontSize: 9,
									fontWeight: 700,
									color:
										source === 'api'
											? 'var(--accent-green)'
											: 'var(--accent-amber)',
								}}
							>
								{source === 'api'
									? '● Live via GeckoTerminal'
									: '⚡ Loading...'}
							</span>
						</p>
					</div>

					{/* Search */}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 6,
							background: 'var(--surface-2)',
							border: `1px solid ${searchError ? 'rgba(248,113,113,.3)' : 'var(--border-1)'}`,
							borderRadius: 'var(--card-radius-xs)',
							padding: '6px 12px',
							minWidth: 200,
						}}
					>
						<span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
							{isSearching ? '⟳' : '⌕'}
						</span>
						<input
							value={query}
							onChange={e => handleQueryChange(e.target.value)}
							placeholder='Search any pair (ETH/USDC, SOL...)'
							style={{
								background: 'transparent',
								border: 'none',
								outline: 'none',
								fontSize: 12,
								color: 'var(--text-primary)',
								width: 180,
								fontFamily: 'inherit',
							}}
						/>
						{query && (
							<button
								onClick={() => {
									setQuery('')
									setSelectedIdx(0)
								}}
								style={{
									background: 'transparent',
									border: 'none',
									color: 'var(--text-tertiary)',
									cursor: 'pointer',
									fontSize: 12,
								}}
							>
								✕
							</button>
						)}
					</div>
				</div>

				{/* Chain filter */}
				<div
					style={{ display: 'flex', gap: 5, marginBottom: 8, flexWrap: 'wrap' }}
				>
					{allChains.map(c => (
						<button
							key={c}
							onClick={() => {
								setSelectedChain(c)
								setSelectedIdx(0)
							}}
							style={{
								padding: '3px 10px',
								borderRadius: 20,
								fontSize: 10,
								fontWeight: selectedChain === c ? 700 : 500,
								background:
									selectedChain === c
										? `${CHAIN_COLORS[c] ?? 'rgba(0,209,255,.15)'}22`
										: 'var(--surface-2)',
								border: `1px solid ${selectedChain === c ? (CHAIN_COLORS[c] ?? 'var(--accent-blue)') : 'var(--border-1)'}`,
								color:
									selectedChain === c
										? (CHAIN_COLORS[c] ?? 'var(--accent-blue)')
										: 'var(--text-secondary)',
								cursor: 'pointer',
								transition: 'all .15s',
							}}
						>
							{c}
						</button>
					))}
				</div>

				{/* Pool pills */}
				{isLoading ? (
					<div style={{ display: 'flex', gap: 6 }}>
						{[0, 1, 2, 3, 4].map(i => (
							<div
								key={i}
								className='skeleton'
								style={{
									width: 110,
									height: 30,
									borderRadius: 20,
									flexShrink: 0,
								}}
							/>
						))}
					</div>
				) : filtered.length === 0 ? (
					<div
						style={{
							padding: '8px 0',
							fontSize: 12,
							color: 'var(--text-tertiary)',
							display: 'flex',
							alignItems: 'center',
							gap: 8,
						}}
					>
						{isSearching ? (
							<>
								<span
									style={{
										animation: 'spin .8s linear infinite',
										display: 'inline-block',
									}}
								>
									⟳
								</span>{' '}
								Searching GeckoTerminal API...
							</>
						) : searchError ? (
							<span style={{ color: 'var(--accent-red)' }}>
								⚠ {searchError}
							</span>
						) : (
							`No pools found for "${query}"`
						)}
					</div>
				) : (
					<div
						style={{
							display: 'flex',
							gap: 5,
							overflowX: 'auto',
							scrollbarWidth: 'none',
							paddingBottom: 2,
						}}
					>
						{filtered.map((pool, i) => {
							const isActive = selectedIdx === i
							const chainColor =
								CHAIN_COLORS[pool.chain] ?? 'var(--accent-blue)'
							return (
								<button
									key={pool.id}
									onClick={() => setSelectedIdx(i)}
									style={{
										padding: '5px 10px',
										borderRadius: 20,
										fontSize: 10,
										fontWeight: isActive ? 700 : 500,
										background: isActive
											? `rgba(0,209,255,.12)`
											: 'var(--surface-2)',
										border: `1px solid ${isActive ? 'rgba(0,209,255,.3)' : 'var(--border-1)'}`,
										color: isActive
											? 'var(--accent-blue)'
											: 'var(--text-secondary)',
										cursor: 'pointer',
										transition: 'all .15s',
										whiteSpace: 'nowrap',
										flexShrink: 0,
										display: 'flex',
										alignItems: 'center',
										gap: 5,
									}}
								>
									<span
										style={{
											width: 5,
											height: 5,
											borderRadius: '50%',
											background: chainColor,
											flexShrink: 0,
										}}
									/>
									<span>{pool.pair}</span>
									<span style={{ fontSize: 8, opacity: 0.6 }}>
										{pool.feeTier}
									</span>
									{pool.tvl > 0 && (
										<span
											style={{
												fontSize: 8,
												opacity: 0.7,
												background: isActive
													? 'rgba(0,209,255,.1)'
													: 'var(--surface-3)',
												padding: '1px 4px',
												borderRadius: 6,
											}}
										>
											{fmtTVL(pool.tvl)}
										</span>
									)}
								</button>
							)
						})}
					</div>
				)}
			</div>

			{/* Map */}
			<div
				style={{
					flex: 1,
					background: 'var(--bg-secondary)',
					overflow: 'hidden',
					position: 'relative',
					minHeight: 0,
				}}
			>
				{selected && (
					<LiquidityHeatMap
						key={selected.id}
						pair={selected.pair}
						feeTier={selected.feeTier}
					/>
				)}
			</div>
		</div>
	)
}
