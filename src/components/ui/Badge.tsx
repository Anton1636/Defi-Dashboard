// Маленький кольоровий тег для протоколів і статусів
interface BadgeProps {
	label: string
	variant?: 'blue' | 'green' | 'purple' | 'amber' | 'red' | 'gray'
}

const VARIANTS = {
	blue: 'bg-blue-50 text-blue-700 border-blue-100',
	green: 'bg-green-50 text-green-700 border-green-100',
	purple: 'bg-purple-50 text-purple-700 border-purple-100',
	amber: 'bg-amber-50 text-amber-700 border-amber-100',
	red: 'bg-red-50 text-red-700 border-red-100',
	gray: 'bg-gray-50 text-gray-600 border-gray-100',
}

const PROTOCOL_VARIANTS: Record<string, BadgeProps['variant']> = {
	uniswap: 'purple',
	aave: 'blue',
	compound: 'green',
}

export function Badge({ label, variant = 'gray' }: BadgeProps) {
	return (
		<span
			className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${VARIANTS[variant]}`}
		>
			{label}
		</span>
	)
}

// Хелпер для протоколів — автоматично вибирає колір
export function ProtocolBadge({ protocol }: { protocol: string }) {
	const variant = PROTOCOL_VARIANTS[protocol.toLowerCase()] ?? 'gray'
	return <Badge label={protocol.toUpperCase()} variant={variant} />
}
