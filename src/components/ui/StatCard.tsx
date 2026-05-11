// Картка з одним числовим показником
// Використовується для: Total Value, 24h Change, Best APY тощо
interface StatCardProps {
	label: string
	value: string
	subValue?: string // додатковий текст під числом
	trend?: 'up' | 'down' | 'neutral'
	isLoading?: boolean
}

export function StatCard({
	label,
	value,
	subValue,
	trend = 'neutral',
	isLoading = false,
}: StatCardProps) {
	const trendColor = {
		up: 'text-green-600',
		down: 'text-red-500',
		neutral: 'text-gray-500',
	}[trend]

	if (isLoading) {
		return (
			<div className='bg-white rounded-xl border border-gray-100 p-5 animate-pulse'>
				<div className='h-3.5 bg-gray-100 rounded w-24 mb-3' />
				<div className='h-7 bg-gray-100 rounded w-32 mb-2' />
				<div className='h-3 bg-gray-100 rounded w-20' />
			</div>
		)
	}

	return (
		<div className='bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 transition-colors'>
			<p className='text-sm text-gray-500 mb-1'>{label}</p>
			<p className='text-2xl font-semibold text-gray-900 mb-1'>{value}</p>
			{subValue && (
				<p className={`text-xs font-medium ${trendColor}`}>{subValue}</p>
			)}
		</div>
	)
}
