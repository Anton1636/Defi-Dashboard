import type { UniswapPosition } from '@/types'

function formatUSD(v: number) {
	if (v >= 1000) return `$${(v / 1000).toFixed(2)}K`
	return `$${v.toFixed(2)}`
}

interface UniswapCardProps {
	position: UniswapPosition
}

export function UniswapCard({ position }: UniswapCardProps) {
	return (
		<div className='bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 transition-colors'>
			{/* Header */}
			<div className='flex items-center justify-between mb-4'>
				<div className='flex items-center gap-3'>
					<div className='w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-xl'>
						🦄
					</div>
					<div>
						<p className='font-semibold text-gray-900'>
							{position.token0.symbol}/{position.token1.symbol}
						</p>
						<p className='text-xs text-gray-400'>Uniswap V3 · Ethereum</p>
					</div>
				</div>

				{/* In range / Out of range badge */}
				<span
					className={`text-xs font-medium px-2.5 py-1 rounded-full ${
						position.inRange
							? 'bg-green-50 text-green-700'
							: 'bg-amber-50 text-amber-700'
					}`}
				>
					{position.inRange ? '● In range' : '○ Out of range'}
				</span>
			</div>

			{/* Stats grid */}
			<div className='grid grid-cols-3 gap-3'>
				<div className='bg-gray-50 rounded-lg p-3'>
					<p className='text-xs text-gray-400 mb-1'>Position value</p>
					<p className='text-sm font-semibold text-gray-900'>
						{formatUSD(position.valueUSD)}
					</p>
				</div>
				<div className='bg-gray-50 rounded-lg p-3'>
					<p className='text-xs text-gray-400 mb-1'>Fees earned</p>
					<p className='text-sm font-semibold text-green-600'>
						{formatUSD(position.feesEarned)}
					</p>
				</div>
				<div className='bg-gray-50 rounded-lg p-3'>
					<p className='text-xs text-gray-400 mb-1'>Pool ID</p>
					<p className='text-sm font-mono text-gray-500 truncate'>
						{position.poolId.slice(0, 8)}...
					</p>
				</div>
			</div>

			{/* Token breakdown */}
			<div className='mt-3 flex gap-2'>
				<div className='flex-1 bg-gray-50 rounded-lg p-2.5 text-xs'>
					<span className='text-gray-400'>Token 0: </span>
					<span className='font-medium text-gray-700'>
						{position.token0.symbol}
					</span>
					<span className='text-gray-400 ml-1'>
						${position.token0.priceUSD.toFixed(2)}
					</span>
				</div>
				<div className='flex-1 bg-gray-50 rounded-lg p-2.5 text-xs'>
					<span className='text-gray-400'>Token 1: </span>
					<span className='font-medium text-gray-700'>
						{position.token1.symbol}
					</span>
					<span className='text-gray-400 ml-1'>
						${position.token1.priceUSD.toFixed(2)}
					</span>
				</div>
			</div>
		</div>
	)
}
