import type { AavePosition } from '@/types'

function formatUSD(v: number) {
	if (v >= 1000) return `$${(v / 1000).toFixed(2)}K`
	return `$${v.toFixed(2)}`
}

interface AaveCardProps {
	position: AavePosition
}

export function AaveCard({ position }: AaveCardProps) {
	// Liquidation risk
	const hfColor =
		position.healthFactor > 2
			? 'text-green-600 bg-green-50'
			: position.healthFactor > 1.5
				? 'text-amber-600 bg-amber-50'
				: 'text-red-600 bg-red-50'

	// Health factor bar
	const hfPercent = Math.min((position.healthFactor / 3) * 100, 100)
	const hfBarColor =
		position.healthFactor > 2
			? 'bg-green-400'
			: position.healthFactor > 1.5
				? 'bg-amber-400'
				: 'bg-red-400'

	return (
		<div className='bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 transition-colors'>
			{/* Header */}
			<div className='flex items-center justify-between mb-4'>
				<div className='flex items-center gap-3'>
					<div className='w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xl'>
						👻
					</div>
					<div>
						<p className='font-semibold text-gray-900'>Aave V3</p>
						<p className='text-xs text-gray-400'>Lending · Ethereum</p>
					</div>
				</div>
				<span
					className={`text-xs font-semibold px-2.5 py-1 rounded-full ${hfColor}`}
				>
					HF: {position.healthFactor.toFixed(2)}
				</span>
			</div>

			{/* Health factor bar */}
			<div className='mb-4'>
				<div className='flex justify-between text-xs text-gray-400 mb-1'>
					<span>Health factor</span>
					<span
						className={
							position.healthFactor < 1.5 ? 'text-red-500 font-medium' : ''
						}
					>
						{position.healthFactor < 1.5 ? '⚠ Liquidation risk' : 'Safe'}
					</span>
				</div>
				<div className='h-1.5 bg-gray-100 rounded-full overflow-hidden'>
					<div
						className={`h-full rounded-full transition-all ${hfBarColor}`}
						style={{ width: `${hfPercent}%` }}
					/>
				</div>
			</div>

			{/* Stats grid */}
			<div className='grid grid-cols-3 gap-3 mb-4'>
				<div className='bg-gray-50 rounded-lg p-3'>
					<p className='text-xs text-gray-400 mb-1'>Net worth</p>
					<p className='text-sm font-semibold text-gray-900'>
						{formatUSD(position.valueUSD)}
					</p>
				</div>
				<div className='bg-gray-50 rounded-lg p-3'>
					<p className='text-xs text-gray-400 mb-1'>Collateral</p>
					<p className='text-sm font-semibold text-gray-900'>
						{formatUSD(position.totalCollateralUSD)}
					</p>
				</div>
				<div className='bg-gray-50 rounded-lg p-3'>
					<p className='text-xs text-gray-400 mb-1'>Debt</p>
					<p className='text-sm font-semibold text-red-500'>
						{formatUSD(position.totalDebtUSD)}
					</p>
				</div>
			</div>

			{/* Supplies */}
			{position.supplies.length > 0 && (
				<div className='mb-3'>
					<p className='text-xs font-medium text-gray-500 mb-2'>Supplied</p>
					<div className='space-y-1.5'>
						{position.supplies.map(s => (
							<div
								key={s.symbol}
								className='flex justify-between items-center bg-green-50 rounded-lg px-3 py-2'
							>
								<span className='text-xs font-medium text-gray-700'>
									{s.symbol}
								</span>
								<div className='text-right'>
									<span className='text-xs text-gray-600'>
										{formatUSD(s.valueUSD)}
									</span>
									<span className='text-xs text-green-600 ml-2'>
										{s.apy.toFixed(2)}% APY
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Borrows */}
			{position.borrows.length > 0 && (
				<div>
					<p className='text-xs font-medium text-gray-500 mb-2'>Borrowed</p>
					<div className='space-y-1.5'>
						{position.borrows.map(b => (
							<div
								key={b.symbol}
								className='flex justify-between items-center bg-red-50 rounded-lg px-3 py-2'
							>
								<span className='text-xs font-medium text-gray-700'>
									{b.symbol}
								</span>
								<div className='text-right'>
									<span className='text-xs text-gray-600'>
										{formatUSD(b.valueUSD)}
									</span>
									<span className='text-xs text-red-500 ml-2'>
										{b.apy.toFixed(2)}% APR
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
