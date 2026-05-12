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

const PROTOCOL_COLORS: Record<string, string> = {
	uniswap: '#ff007a',
	aave: '#b6509e',
	compound: '#00d395',
}

function formatUSD(value: number): string {
	if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
	if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`
	return `$${value.toFixed(2)}`
}

interface TooltipProps {
	active?: boolean
	payload?: Array<{
		name: string
		value: number
		payload: { percent: number }
	}>
}

function CustomTooltip({ active, payload }: TooltipProps) {
	if (!active || !payload?.length) return null
	return (
		<div
			style={{
				background: 'var(--bg-elevated)',
				border: '1px solid var(--border-secondary)',
				borderRadius: '10px',
				padding: '10px 14px',
				fontSize: '13px',
			}}
		>
			<p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
				{payload[0].name}
			</p>
			<p style={{ color: 'var(--text-secondary)' }}>
				{formatUSD(payload[0].value)}
			</p>
			<p style={{ color: 'var(--text-tertiary)' }}>
				{payload[0].payload.percent}%
			</p>
		</div>
	)
}

export function PortfolioChart({
	positions,
	totalValueUSD,
}: PortfolioChartProps) {
	if (positions.length === 0) {
		return (
			<div
				style={{
					background: 'var(--gradient-card)',
					border: '1px solid var(--border-primary)',
					borderRadius: '16px',
					padding: '20px',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '280px',
				}}
			>
				<p
					style={{
						fontSize: '12px',
						color: 'var(--text-tertiary)',
						marginBottom: '16px',
					}}
				>
					Asset allocation
				</p>
				<p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>
					No positions found
				</p>
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
		<div
			style={{
				background: 'var(--gradient-card)',
				border: '1px solid var(--border-primary)',
				borderRadius: '16px',
				padding: '20px',
			}}
		>
			<p
				style={{
					fontSize: '12px',
					color: 'var(--text-tertiary)',
					marginBottom: '16px',
				}}
			>
				Asset allocation
			</p>

			<ResponsiveContainer width='100%' height={200}>
				<PieChart>
					<Pie
						data={chartData}
						cx='50%'
						cy='50%'
						innerRadius={55}
						outerRadius={80}
						paddingAngle={4}
						dataKey='value'
						strokeWidth={0}
					>
						{chartData.map((entry, index) => (
							<Cell
								key={index}
								fill={entry.color}
								style={{ filter: `drop-shadow(0 0 8px ${entry.color}66)` }}
							/>
						))}
					</Pie>
					<Tooltip content={<CustomTooltip />} />
					<Legend
						formatter={value => (
							<span
								style={{ fontSize: '12px', color: 'var(--text-secondary)' }}
							>
								{value}
							</span>
						)}
					/>
				</PieChart>
			</ResponsiveContainer>

			{/* Total */}
			<div style={{ textAlign: 'center', marginTop: '8px' }}>
				<p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Total</p>
				<p
					style={{
						fontSize: '18px',
						fontWeight: 600,
						color: 'var(--text-primary)',
					}}
				>
					{formatUSD(totalValueUSD)}
				</p>
			</div>
		</div>
	)
}
