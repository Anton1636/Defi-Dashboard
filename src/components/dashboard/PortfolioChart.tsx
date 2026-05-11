'use client'

import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from 'recharts'
import type { DeFiPosition } from '@/types'

interface PortfolioChartProps {
	positions: DeFiPosition[]
	totalValueUSD: number
}

interface TooltipProps {
	active?: boolean
	payload?: Array<{
		name: string
		value: number
		payload: {
			percent: number
		}
	}>
}

const PROTOCOL_COLORS: Record<string, string> = {
	uniswap: '#7C3AED', // purple
	aave: '#2563EB', // blue
	compound: '#059669', // green
}

function formatUSD(value: number): string {
	if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
	if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`
	return `$${value.toFixed(2)}`
}

function CustomTooltip({ active, payload }: TooltipProps) {
	if (!active || !payload?.length) return null

	return (
		<div className='bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-sm text-sm'>
			<p className='font-medium text-gray-900'>{payload[0].name}</p>
			<p className='text-gray-500'>{formatUSD(payload[0].value)}</p>
			<p className='text-gray-400'>{payload[0].payload.percent}%</p>
		</div>
	)
}

export function PortfolioChart({
	positions,
	totalValueUSD,
}: PortfolioChartProps) {
	if (positions.length === 0) {
		return (
			<div className='bg-white rounded-xl border border-gray-100 p-5'>
				<p className='text-sm text-gray-500 mb-4'>Asset allocation</p>
				<div className='flex items-center justify-center h-48 text-gray-300 text-sm'>
					No positions found
				</div>
			</div>
		)
	}

	const chartData = Object.entries(
		positions.reduce<Record<string, number>>((acc, pos) => {
			acc[pos.protocol] = (acc[pos.protocol] ?? 0) + pos.valueUSD
			return acc
		}, {}),
	).map(([protocol, value]) => ({
		name: protocol.charAt(0).toUpperCase() + protocol.slice(1),
		value: Math.round(value * 100) / 100,
		percent: totalValueUSD > 0 ? Math.round((value / totalValueUSD) * 100) : 0,
		color: PROTOCOL_COLORS[protocol] ?? '#6B7280',
	}))

	return (
		<div className='bg-white rounded-xl border border-gray-100 p-5'>
			<p className='text-sm text-gray-500 mb-4'>Asset allocation</p>

			<ResponsiveContainer width='100%' height={220}>
				<PieChart>
					<Pie
						data={chartData}
						cx='50%'
						cy='50%'
						innerRadius={60} // donut chart — innerRadius > 0
						outerRadius={90}
						paddingAngle={3}
						dataKey='value'
					>
						{chartData.map((entry, index) => (
							<Cell key={index} fill={entry.color} />
						))}
					</Pie>
					<Tooltip content={<CustomTooltip />} />
					<Legend
						formatter={value => (
							<span className='text-xs text-gray-600'>{value}</span>
						)}
					/>
				</PieChart>
			</ResponsiveContainer>

			<div className='text-center -mt-2'>
				<p className='text-xs text-gray-400'>Total</p>
				<p className='text-lg font-semibold text-gray-900'>
					{formatUSD(totalValueUSD)}
				</p>
			</div>
		</div>
	)
}
