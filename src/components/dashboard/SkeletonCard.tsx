export function SkeletonCard({ lines = 3 }: { lines?: number }) {
	return (
		<div className='bg-white rounded-xl border border-gray-100 p-5 animate-pulse'>
			<div className='flex items-center justify-between mb-4'>
				<div className='h-4 bg-gray-100 rounded w-32' />
				<div className='h-6 bg-gray-100 rounded w-16' />
			</div>
			{Array.from({ length: lines }).map((_, i) => (
				<div
					key={i}
					className='flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0'
				>
					<div className='flex items-center gap-3'>
						<div className='w-8 h-8 bg-gray-100 rounded-full' />
						<div>
							<div className='h-3.5 bg-gray-100 rounded w-20 mb-1.5' />
							<div className='h-3 bg-gray-100 rounded w-14' />
						</div>
					</div>
					<div className='text-right'>
						<div className='h-3.5 bg-gray-100 rounded w-16 mb-1.5' />
						<div className='h-3 bg-gray-100 rounded w-12' />
					</div>
				</div>
			))}
		</div>
	)
}
