'use client'

import { usePortfolio } from '@/hooks/usePortfolio'
import { useWallet } from '@/hooks/useWallet'
import { StatCard } from '@/components/ui/StatCard'
import { PortfolioChart } from '@/components/dashboard/PortfolioChart'
import { PositionRow } from '@/components/dashboard/PositionRow'
import { SkeletonCard } from '@/components/dashboard/SkeletonCard'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { AavePosition, CompoundPosition } from '@/types'

function formatUSD(value: number): string {
	if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
	if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`
	return `$${value.toFixed(2)}`
}

export default function PortfolioPage() {
	const { isConnected, address } = useWallet()
	const { data: portfolio, isLoading, error } = usePortfolio()

	if (!isConnected) {
		return (
			<div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
				<div className='text-4xl'>◈</div>
				<h2 className='text-xl font-semibold text-gray-900'>
					Connect your wallet
				</h2>
				<p className='text-gray-500 text-sm mb-2'>
					Connect MetaMask to see your DeFi positions
				</p>
				<ConnectButton />
			</div>
		)
	}

	if (isLoading) {
		return (
			<div>
				<div className='mb-6'>
					<h1 className='text-2xl font-semibold text-gray-900'>Portfolio</h1>
					<p className='text-gray-400 text-sm mt-1'>
						{address?.slice(0, 6)}...{address?.slice(-4)}
					</p>
				</div>

				{/* Skeleton for stat cards */}
				<div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
					{Array.from({ length: 4 }).map((_, i) => (
						<StatCard key={i} label='' value='' isLoading />
					))}
				</div>

				{/* Skeleton for positions */}
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
					<div className='lg:col-span-2'>
						<SkeletonCard lines={4} />
					</div>
					<SkeletonCard lines={3} />
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex flex-col items-center justify-center min-h-[60vh] gap-3'>
				<p className='text-red-500 font-medium'>Failed to load portfolio</p>
				<p className='text-gray-400 text-sm'>{(error as Error).message}</p>
			</div>
		)
	}

	const totalValue = portfolio?.totalValueUSD ?? 0
	const change = portfolio?.change24hPercent ?? 0
	const positions = portfolio?.positions ?? []

	const bestAPY = positions.reduce((best, pos) => {
		const apy =
			pos.protocol === 'aave'
				? (pos as AavePosition).netAPY
				: pos.protocol === 'compound'
					? (pos as CompoundPosition).supplyAPR
					: 0
		return apy > best ? apy : best
	}, 0)

	return (
		<div>
			{/* Header */}
			<div className='flex items-center justify-between mb-6'>
				<div>
					<h1 className='text-2xl font-semibold text-gray-900'>Portfolio</h1>
					<p className='text-gray-400 text-sm mt-0.5 font-mono'>
						{address?.slice(0, 6)}...{address?.slice(-4)}
					</p>
				</div>
				<p className='text-xs text-gray-400'>
					Updated{' '}
					{portfolio?.lastUpdated
						? new Date(portfolio.lastUpdated).toLocaleTimeString()
						: '—'}
				</p>
			</div>

			{/* Stat cards */}
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
				<StatCard
					label='Total value'
					value={formatUSD(totalValue)}
					subValue={
						change !== 0
							? `${change > 0 ? '+' : ''}${change.toFixed(2)}% 24h`
							: undefined
					}
					trend={change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'}
				/>
				<StatCard
					label='Positions'
					value={positions.length.toString()}
					subValue={`${new Set(positions.map(p => p.protocol)).size} protocols`}
				/>
				<StatCard
					label='Best APY'
					value={bestAPY > 0 ? `${bestAPY.toFixed(2)}%` : '—'}
					trend={bestAPY > 0 ? 'up' : 'neutral'}
				/>
				<StatCard label='Network' value='Ethereum' subValue='Mainnet' />
			</div>

			{/* Main content */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
				{/* Positions list */}
				<div className='lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5'>
					<div className='flex items-center justify-between mb-4'>
						<p className='text-sm font-medium text-gray-700'>Open positions</p>
						<span className='text-xs text-gray-400'>
							{positions.length} total
						</span>
					</div>

					{positions.length === 0 ? (
						<div className='flex flex-col items-center justify-center py-12 text-gray-300'>
							<p className='text-4xl mb-3'>◎</p>
							<p className='text-sm'>No DeFi positions found</p>
							<p className='text-xs mt-1'>
								Start by supplying assets to Aave or adding liquidity on Uniswap
							</p>
						</div>
					) : (
						positions.map(position => (
							<PositionRow key={position.id} position={position} />
						))
					)}
				</div>

				{/* Chart */}
				<PortfolioChart positions={positions} totalValueUSD={totalValue} />
			</div>
		</div>
	)
}
