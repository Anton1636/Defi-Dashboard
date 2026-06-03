'use client'

import { useState, useMemo } from 'react'
import {
	AreaChart,
	Area,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from 'recharts'
import {
	generatePortfolioChartData,
	generateProtocolSeries,
	calcChange,
	type TimeRange,
} from '@/lib/chartData'

const TIME_RANGES: TimeRange[] = ['24H', '7D', '30D', '90D', '1Y', 'ALL']

type ChartMode = 'total' | 'protocols'

function fmt(v: number) {
	if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
	if (v >= 1_000) return `$${(v / 1_000).toFixed(2)}K`
	return `$${v.toFixed(2)}`
}

interface CustomTooltipProps {
	active?: boolean
	payload?: Array<{ value: number; name: string; color: string }>
	label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
	if (!active || !payload?.length) return null
	return (
		<div
			style={{
				background: 'rgba(5,6,10,.97)',
				border: '1px solid rgba(255,255,255,.12)',
				borderRadius: 10,
				padding: '10px 14px',
				boxShadow: '0 8px 24px rgba(0,0,0,.5)',
			}}
		>
			<p
				style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginBottom: 6 }}
			>
				{label}
			</p>
			{payload.map((p, i) => (
				<div
					key={i}
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 8,
						marginBottom: 3,
					}}
				>
					<div
						style={{
							width: 8,
							height: 8,
							borderRadius: 2,
							background: p.color,
							flexShrink: 0,
						}}
					/>
					<span
						style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', flex: 1 }}
					>
						{p.name}
					</span>
					<span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>
						{fmt(p.value)}
					</span>
				</div>
			))}
		</div>
	)
}

interface PortfolioChartProps {
	totalValue: number
	positions: { protocol: string; valueUSD: number }[]
	compact?: boolean
}

export function PortfolioChart({
	totalValue,
	positions,
	compact = false,
}: PortfolioChartProps) {
	const [range, setRange] = useState<TimeRange>('30D')
	const [mode, setMode] = useState<ChartMode>('total')
	const [hovered, setHovered] = useState<number | null>(null)

	const totalData = useMemo(
		() => generatePortfolioChartData(totalValue, range),
		[totalValue, range],
	)

	const protocolData = useMemo(
		() => generateProtocolSeries(positions, range),
		[positions, range],
	)

	const change = useMemo(() => calcChange(totalData), [totalData])

	// Merge protocol data for multi-line chart
	const mergedData = useMemo(() => {
		if (!protocolData.length) return []
		return protocolData[0].data.map((_, i) => {
			const point: Record<string, unknown> = {
				label: protocolData[0].data[i].label,
			}
			protocolData.forEach(s => {
				point[s.name] = s.data[i]?.value ?? 0
			})
			return point
		})
	}, [protocolData])

	const displayValue =
		hovered !== null ? (totalData[hovered]?.value ?? totalValue) : totalValue

	return (
		<div
			style={{
				background: 'var(--card-bg)',
				border: '1px solid var(--card-border)',
				borderRadius: 'var(--card-radius)',
				padding: compact ? 16 : 20,
				position: 'relative',
				overflow: 'hidden',
				boxShadow: 'var(--shadow-card)',
			}}
		>
			{/* Accent line */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 2,
					background:
						'linear-gradient(90deg,var(--accent-blue),var(--accent-purple),transparent)',
				}}
			/>

			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'flex-start',
					justifyContent: 'space-between',
					marginBottom: 16,
					flexWrap: 'wrap',
					gap: 10,
				}}
			>
				<div>
					<p
						style={{
							fontSize: 12,
							color: 'var(--text-tertiary)',
							marginBottom: 4,
							fontWeight: 600,
						}}
					>
						Portfolio Overview
					</p>
					<div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
						<p
							style={{
								fontSize: 28,
								fontWeight: 900,
								letterSpacing: '-1.5px',
								color: '#fff',
								fontVariantNumeric: 'tabular-nums',
							}}
						>
							{fmt(displayValue)}
						</p>
						<p
							style={{
								fontSize: 12,
								fontWeight: 700,
								color:
									change.pct >= 0 ? 'var(--accent-green)' : 'var(--accent-red)',
							}}
						>
							{change.pct >= 0 ? '↑' : '↓'} {fmt(Math.abs(change.value))} (
							{Math.abs(change.pct).toFixed(2)}%)
						</p>
					</div>
				</div>

				<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
					{/* Mode toggle */}
					<div
						style={{
							display: 'flex',
							background: 'var(--surface-2)',
							border: '1px solid var(--border-1)',
							borderRadius: 'var(--card-radius-xs)',
							padding: 2,
						}}
					>
						{(['total', 'protocols'] as ChartMode[]).map(m => (
							<button
								key={m}
								onClick={() => setMode(m)}
								style={{
									padding: '4px 12px',
									borderRadius: 6,
									fontSize: 10,
									fontWeight: 700,
									background: mode === m ? 'var(--surface-4)' : 'transparent',
									color: mode === m ? '#fff' : 'var(--text-tertiary)',
									border: 'none',
									cursor: 'pointer',
									transition: 'all .15s',
									textTransform: 'capitalize',
								}}
							>
								{m}
							</button>
						))}
					</div>

					{/* Time range */}
					<div style={{ display: 'flex', gap: 3 }}>
						{TIME_RANGES.map(r => (
							<button
								key={r}
								onClick={() => setRange(r)}
								style={{
									padding: '4px 9px',
									borderRadius: 6,
									fontSize: 10,
									fontWeight: 700,
									background:
										range === r
											? 'rgba(0,209,255,.12)'
											: 'rgba(255,255,255,.04)',
									border: `1px solid ${range === r ? 'rgba(0,209,255,.25)' : 'rgba(255,255,255,.07)'}`,
									color:
										range === r
											? 'var(--accent-blue)'
											: 'rgba(255,255,255,.35)',
									cursor: 'pointer',
									transition: 'all .15s',
								}}
							>
								{r}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Chart */}
			<div style={{ height: compact ? 160 : 220 }}>
				<ResponsiveContainer width='100%' height='100%'>
					{mode === 'total' ? (
						<AreaChart
							data={totalData.map(p => ({ label: p.label, value: p.value }))}
							margin={{ top: 5, right: 4, left: 0, bottom: 0 }}
							onMouseMove={e => {
								if (e.activeTooltipIndex !== undefined)
									setHovered(e.activeTooltipIndex)
							}}
							onMouseLeave={() => setHovered(null)}
						>
							<defs>
								<linearGradient id='pf-stroke' x1='0' y1='0' x2='1' y2='0'>
									<stop offset='0%' stopColor='#7b61ff' />
									<stop offset='50%' stopColor='#00d1ff' />
									<stop offset='100%' stopColor='#00d1ff' />
								</linearGradient>
								<linearGradient id='pf-fill' x1='0' y1='0' x2='0' y2='1'>
									<stop offset='0%' stopColor='#00d1ff' stopOpacity='0.18' />
									<stop offset='100%' stopColor='#7b61ff' stopOpacity='0' />
								</linearGradient>
							</defs>
							<CartesianGrid
								strokeDasharray='4 8'
								stroke='rgba(255,255,255,.04)'
								vertical={false}
							/>
							<XAxis
								dataKey='label'
								tick={{ fontSize: 9, fill: 'rgba(255,255,255,.2)' }}
								tickLine={false}
								axisLine={false}
								interval='preserveStartEnd'
							/>
							<YAxis domain={['dataMin', 'dataMax']} hide />
							<Tooltip content={<CustomTooltip />} />
							<Area
								type='monotone'
								dataKey='value'
								name='Portfolio'
								stroke='url(#pf-stroke)'
								strokeWidth={2}
								fill='url(#pf-fill)'
								dot={false}
								activeDot={{
									r: 4,
									fill: '#00d1ff',
									stroke: 'rgba(0,209,255,.3)',
									strokeWidth: 6,
								}}
							/>
						</AreaChart>
					) : (
						<LineChart
							data={mergedData}
							margin={{ top: 5, right: 4, left: 0, bottom: 0 }}
						>
							<CartesianGrid
								strokeDasharray='4 8'
								stroke='rgba(255,255,255,.04)'
								vertical={false}
							/>
							<XAxis
								dataKey='label'
								tick={{ fontSize: 9, fill: 'rgba(255,255,255,.2)' }}
								tickLine={false}
								axisLine={false}
								interval='preserveStartEnd'
							/>
							<YAxis domain={['dataMin', 'dataMax']} hide />
							<Tooltip content={<CustomTooltip />} />
							<Legend
								wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
								formatter={value => (
									<span style={{ color: 'rgba(255,255,255,.5)' }}>{value}</span>
								)}
							/>
							{protocolData.map(s => (
								<Line
									key={s.name}
									type='monotone'
									dataKey={s.name}
									stroke={s.color}
									strokeWidth={1.5}
									dot={false}
									activeDot={{ r: 3, fill: s.color }}
								/>
							))}
						</LineChart>
					)}
				</ResponsiveContainer>
			</div>
		</div>
	)
}
