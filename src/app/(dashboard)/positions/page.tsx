'use client'

import { useState } from 'react'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useWallet } from '@/hooks/useWallet'
import { ProtocolFilter } from '@/components/positions/ProtocolFilter'
import { UniswapCard } from '@/components/positions/UniswapCard'
import { AaveCard } from '@/components/positions/AaveCard'
import { CompoundCard } from '@/components/positions/CompoundCard'
import { SkeletonCard } from '@/components/dashboard/SkeletonCard'
import dynamic from 'next/dynamic'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type {
	DeFiPosition,
	UniswapPosition,
	AavePosition,
	CompoundPosition,
} from '@/types'

const RiskScanner = dynamic(
	() => import('@/components/risk/RiskScanner').then(m => m.RiskScanner),
	{ ssr: false },
)

type FilterProtocol = 'all' | 'uniswap' | 'aave' | 'compound'

export default function PositionsPage() {
	const { isConnected } = useWallet()
	const { data: portfolio, isLoading, error } = usePortfolio()
	const [activeFilter, setActiveFilter] = useState<FilterProtocol>('all')

	const counts: Record<string, number> = { uniswap: 0, aave: 0, compound: 0 }
	portfolio?.positions.forEach(p => {
		counts[p.protocol] = (counts[p.protocol] ?? 0) + 1
	})

	const filtered = !portfolio?.positions
		? []
		: activeFilter === 'all'
			? portfolio.positions
			: portfolio.positions.filter(p => p.protocol === activeFilter)

	if (!isConnected) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '60vh',
					gap: 16,
				}}
			>
				<div style={{ fontSize: 48 }}>⬡</div>
				<h2
					style={{
						fontSize: 20,
						fontWeight: 800,
						letterSpacing: '-0.5px',
						color: 'var(--text-primary)',
					}}
				>
					Connect your wallet
				</h2>
				<p
					style={{
						fontSize: 14,
						color: 'var(--text-secondary)',
						marginBottom: 8,
					}}
				>
					Connect to see your DeFi positions
				</p>
				<ConnectButton />
			</div>
		)
	}

	if (isLoading) {
		return (
			<div className='fade-in'>
				<div style={{ marginBottom: 20 }}>
					<div
						className='skeleton'
						style={{ height: 28, width: 120, marginBottom: 6 }}
					/>
					<div className='skeleton' style={{ height: 14, width: 200 }} />
				</div>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
						gap: 12,
					}}
				>
					{Array.from({ length: 3 }).map((_, i) => (
						<SkeletonCard key={i} lines={4} />
					))}
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '60vh',
				}}
			>
				<p style={{ color: 'var(--accent-red)', fontWeight: 600 }}>
					Failed to load positions
				</p>
			</div>
		)
	}

	return (
		<div className='fade-in'>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 20,
				}}
			>
				<div>
					<h1
						style={{
							fontSize: 24,
							fontWeight: 900,
							color: 'var(--text-primary)',
							letterSpacing: '-1px',
							marginBottom: 3,
						}}
					>
						Positions
					</h1>
					<p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
						{portfolio?.positions.length ?? 0} open positions across{' '}
						{Object.values(counts).filter(Boolean).length} protocols
					</p>
				</div>
			</div>

			{/* Filter */}
			<div style={{ marginBottom: 16 }}>
				<ProtocolFilter
					active={activeFilter}
					counts={counts}
					onChange={setActiveFilter}
				/>
			</div>

			{/* Cards */}
			{filtered.length === 0 ? (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '80px 0',
						color: 'var(--text-tertiary)',
					}}
				>
					<p style={{ fontSize: 36, marginBottom: 12 }}>⬡</p>
					<p style={{ fontSize: 13 }}>
						No {activeFilter === 'all' ? '' : activeFilter} positions found
					</p>
				</div>
			) : (
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
						gap: 12,
					}}
				>
					{filtered.map((position: DeFiPosition) => {
						if (position.protocol === 'uniswap')
							return (
								<UniswapCard
									key={position.id}
									position={position as UniswapPosition}
								/>
							)
						if (position.protocol === 'aave')
							return (
								<AaveCard
									key={position.id}
									position={position as AavePosition}
								/>
							)
						if (position.protocol === 'compound')
							return (
								<CompoundCard
									key={position.id}
									position={position as CompoundPosition}
								/>
							)
						return null
					})}
				</div>
			)}

			{/* Risk Scanner */}
			<RiskScanner />
		</div>
	)
}
