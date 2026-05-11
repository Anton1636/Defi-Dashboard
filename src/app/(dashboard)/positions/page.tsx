'use client'

import { useState } from 'react'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useWallet } from '@/hooks/useWallet'
import { ProtocolFilter } from '@/components/positions/ProtocolFilter'
import { UniswapCard } from '@/components/positions/UniswapCard'
import { AaveCard } from '@/components/positions/AaveCard'
import { CompoundCard } from '@/components/positions/CompoundCard'
import { SkeletonCard } from '@/components/dashboard/SkeletonCard'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type {
	DeFiPosition,
	UniswapPosition,
	AavePosition,
	CompoundPosition,
} from '@/types'

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
			<div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
				<div className='text-4xl'>⬡</div>
				<h2 className='text-xl font-semibold text-gray-900'>
					Connect your wallet
				</h2>
				<p className='text-gray-500 text-sm mb-2'>
					Connect to see your DeFi positions
				</p>
				<ConnectButton />
			</div>
		)
	}

	if (isLoading) {
		return (
			<div>
				<div className='mb-6'>
					<h1 className='text-2xl font-semibold text-gray-900'>Positions</h1>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
					{Array.from({ length: 3 }).map((_, i) => (
						<SkeletonCard key={i} lines={4} />
					))}
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex flex-col items-center justify-center min-h-[60vh] gap-3'>
				<p className='text-red-500 font-medium'>Failed to load positions</p>
			</div>
		)
	}

	return (
		<div>
			{/* Header */}
			<div className='flex items-center justify-between mb-6'>
				<div>
					<h1 className='text-2xl font-semibold text-gray-900'>Positions</h1>
					<p className='text-gray-400 text-sm mt-0.5'>
						{portfolio?.positions.length ?? 0} open positions across{' '}
						{Object.values(counts).filter(Boolean).length} protocols
					</p>
				</div>
			</div>

			{/* Protocol filter */}
			<div className='mb-6'>
				<ProtocolFilter
					active={activeFilter}
					counts={counts}
					onChange={setActiveFilter}
				/>
			</div>

			{/* Positions grid */}
			{filtered.length === 0 ? (
				<div className='flex flex-col items-center justify-center py-20 text-gray-300'>
					<p className='text-4xl mb-3'>⬡</p>
					<p className='text-sm text-gray-400'>
						No {activeFilter === 'all' ? '' : activeFilter} positions found
					</p>
				</div>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
					{filtered.map((position: DeFiPosition) => {
						if (position.protocol === 'uniswap') {
							return (
								<UniswapCard
									key={position.id}
									position={position as UniswapPosition}
								/>
							)
						}
						if (position.protocol === 'aave') {
							return (
								<AaveCard
									key={position.id}
									position={position as AavePosition}
								/>
							)
						}
						if (position.protocol === 'compound') {
							return (
								<CompoundCard
									key={position.id}
									position={position as CompoundPosition}
								/>
							)
						}
						return null
					})}
				</div>
			)}
		</div>
	)
}
