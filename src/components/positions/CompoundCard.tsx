import type { CompoundPosition } from '@/types'

function formatUSD(v: number) {
	if (v >= 1000) return `$${(v / 1000).toFixed(2)}K`
	return `$${v.toFixed(2)}`
}

interface CompoundCardProps {
	position: CompoundPosition
}

export function CompoundCard({ position }: CompoundCardProps) {
	//Much of the supplied assets are currently borrowed
	const utilizationRate =
		position.supplied > 0 ? (position.borrowed / position.supplied) * 100 : 0

	return (
		<div className='bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 transition-colors'>
			{/* Header */}
			<div className='flex items-center justify-between mb-4'>
				<div className='flex items-center gap-3'>
					<div className='w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-xl'>
						🏦
					</div>
					<div>
						<p className='font-semibold text-gray-900'>
							Compound V3 · {position.market}
						</p>
						<p className='text-xs text-gray-400'>Money market · Ethereum</p>
					</div>
				</div>
				<span className='text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700'>
					{position.supplyAPR.toFixed(2)}% APR
				</span>
			</div>

			{/* Stats grid */}
			<div className='grid grid-cols-3 gap-3 mb-4'>
				<div className='bg-gray-50 rounded-lg p-3'>
					<p className='text-xs text-gray-400 mb-1'>Net value</p>
					<p className='text-sm font-semibold text-gray-900'>
						{formatUSD(position.valueUSD)}
					</p>
				</div>
				<div className='bg-gray-50 rounded-lg p-3'>
					<p className='text-xs text-gray-400 mb-1'>Supplied</p>
					<p className='text-sm font-semibold text-green-600'>
						{formatUSD(position.supplied)}
					</p>
				</div>
				<div className='bg-gray-50 rounded-lg p-3'>
					<p className='text-xs text-gray-400 mb-1'>Borrowed</p>
					<p className='text-sm font-semibold text-gray-900'>
						{position.borrowed > 0 ? formatUSD(position.borrowed) : '—'}
					</p>
				</div>
			</div>

			{/* APR comparison */}
			<div className='flex gap-2'>
				<div className='flex-1 bg-green-50 rounded-lg p-2.5'>
					<p className='text-xs text-gray-400'>Supply APR</p>
					<p className='text-sm font-semibold text-green-600'>
						{position.supplyAPR.toFixed(2)}%
					</p>
				</div>
				<div className='flex-1 bg-gray-50 rounded-lg p-2.5'>
					<p className='text-xs text-gray-400'>Borrow APR</p>
					<p className='text-sm font-semibold text-gray-600'>
						{position.borrowAPR.toFixed(2)}%
					</p>
				</div>
				{utilizationRate > 0 && (
					<div className='flex-1 bg-gray-50 rounded-lg p-2.5'>
						<p className='text-xs text-gray-400'>Utilization</p>
						<p className='text-sm font-semibold text-gray-600'>
							{utilizationRate.toFixed(1)}%
						</p>
					</div>
				)}
			</div>
		</div>
	)
}
