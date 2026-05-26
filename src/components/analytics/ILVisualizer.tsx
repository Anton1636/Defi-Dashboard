'use client'

import { useState, useMemo } from 'react'
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ReferenceLine,
	ResponsiveContainer,
	ReferenceDot,
} from 'recharts'
import {
	generateILCurve,
	ilPercent,
	ilDollar,
	feesToBreakEven,
	formatIL,
	ilSeverity,
} from '@/lib/impermanentLoss'
import { usePortfolio } from '@/hooks/usePortfolio'
import { usePriceStore } from '@/store/priceStore'
import type { UniswapPosition } from '@/types'

const IL_CURVE = generateILCurve(200)

const REFERENCE_POINTS = [
	{ ratio: 0.5, label: '-50%', il: ilPercent(0.5) },
	{ ratio: 0.75, label: '-25%', il: ilPercent(0.75) },
	{ ratio: 2, label: '+100%', il: ilPercent(2) },
	{ ratio: 4, label: '+300%', il: ilPercent(4) },
]

interface TooltipProps {
	active?: boolean
	payload?: { value: number; payload: { ratio: number; il: number } }[]
}

function CustomTooltip({ active, payload }: TooltipProps) {
	if (!active || !payload?.length) return null
	const { ratio, il } = payload[0].payload
	const sev = ilSeverity(il)
	return (
		<div
			style={{
				background: 'var(--bg-elevated)',
				border: '1px solid var(--border-secondary)',
				borderRadius: 8,
				padding: '10px 12px',
				fontSize: 12,
			}}
		>
			<p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>
				Price:{' '}
				<strong style={{ color: 'var(--text-primary)' }}>
					{ratio.toFixed(2)}x
				</strong>
			</p>
			<p style={{ color: sev.color, fontWeight: 600 }}>IL: {il.toFixed(2)}%</p>
			<p style={{ color: sev.color, fontSize: 11 }}>{sev.label}</p>
		</div>
	)
}

export function ILVisualizer() {
	const { data: portfolio } = usePortfolio()
	const ethPrice = usePriceStore(s => s.prices['ETH']?.price ?? 3245)

	const [initialPrice, setInitialPrice] = useState(ethPrice.toFixed(2))
	const [currentPrice, setCurrentPrice] = useState(ethPrice.toFixed(2))
	const [investment, setInvestment] = useState('10000')

	const priceRatio = useMemo(() => {
		const init = parseFloat(initialPrice) || 1
		const curr = parseFloat(currentPrice) || 1
		return curr / init
	}, [initialPrice, currentPrice])

	const currentIL = ilPercent(priceRatio)
	const ilLoss = ilDollar(parseFloat(investment) || 0, priceRatio)
	const feesNeeded = feesToBreakEven(parseFloat(investment) || 0, priceRatio)
	const severity = ilSeverity(currentIL)

	const uniswapPositions = (portfolio?.positions ?? []).filter(
		p => p.protocol === 'uniswap',
	) as UniswapPosition[]

	const currentPoint = IL_CURVE.reduce((prev, curr) =>
		Math.abs(curr.ratio - priceRatio) < Math.abs(prev.ratio - priceRatio)
			? curr
			: prev,
	)

	return (
		<div className='card' style={{ padding: 20, marginTop: 24 }}>
			{/* Header */}
			<div style={{ marginBottom: 20 }}>
				<p
					style={{
						fontSize: 14,
						fontWeight: 600,
						color: 'var(--text-primary)',
						marginBottom: 4,
					}}
				>
					📉 Impermanent Loss Visualizer
				</p>
				<p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
					Calculate how price changes affect your Uniswap liquidity positions
				</p>
			</div>

			{/* IL Curve Chart */}
			<div style={{ marginBottom: 20 }}>
				<p
					style={{
						fontSize: 11,
						fontWeight: 500,
						color: 'var(--text-tertiary)',
						textTransform: 'uppercase',
						letterSpacing: '0.06em',
						marginBottom: 12,
					}}
				>
					IL curve — price change vs loss
				</p>
				<ResponsiveContainer width='100%' height={220}>
					<LineChart
						data={IL_CURVE}
						margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
					>
						<CartesianGrid
							strokeDasharray='3 3'
							stroke='var(--border-primary)'
						/>
						<XAxis
							dataKey='ratio'
							tickFormatter={v => `${v}x`}
							tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
							tickLine={false}
							domain={[0.1, 10]}
							type='number'
							ticks={[0.25, 0.5, 1, 2, 4, 8]}
						/>
						<YAxis
							tickFormatter={v => `${v.toFixed(0)}%`}
							tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
							tickLine={false}
							domain={[-55, 2]}
						/>
						<Tooltip content={<CustomTooltip />} />

						{/* Breakeven line */}
						<ReferenceLine
							x={1}
							stroke='var(--accent-green)'
							strokeDasharray='4 4'
							label={{
								value: 'No change',
								fill: 'var(--accent-green)',
								fontSize: 10,
								position: 'top',
							}}
						/>

						{/* IL curve */}
						<Line
							type='monotone'
							dataKey='il'
							stroke='var(--accent-blue)'
							strokeWidth={2}
							dot={false}
							activeDot={{ r: 4, fill: 'var(--accent-blue)' }}
						/>

						{/* Current position dot */}
						{Math.abs(priceRatio - 1) > 0.01 && (
							<ReferenceDot
								x={currentPoint.ratio}
								y={currentPoint.il}
								r={6}
								fill={severity.color}
								stroke='var(--bg-card)'
								strokeWidth={2}
							/>
						)}
					</LineChart>
				</ResponsiveContainer>

				{/* Reference points */}
				<div
					style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}
				>
					{REFERENCE_POINTS.map(p => (
						<div
							key={p.ratio}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 4,
								fontSize: 11,
							}}
						>
							<span style={{ color: 'var(--text-tertiary)' }}>
								Price {p.label}:
							</span>
							<span style={{ color: ilSeverity(p.il).color, fontWeight: 600 }}>
								{p.il.toFixed(1)}% IL
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Calculator */}
			<div
				style={{
					background: 'var(--bg-elevated)',
					borderRadius: 12,
					padding: 16,
					marginBottom: 16,
				}}
			>
				<p
					style={{
						fontSize: 12,
						fontWeight: 600,
						color: 'var(--text-secondary)',
						marginBottom: 12,
					}}
				>
					🧮 IL Calculator
				</p>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(3, 1fr)',
						gap: 10,
						marginBottom: 16,
					}}
				>
					{[
						{
							label: 'Initial price ($)',
							value: initialPrice,
							onChange: setInitialPrice,
						},
						{
							label: 'Current price ($)',
							value: currentPrice,
							onChange: setCurrentPrice,
						},
						{
							label: 'Investment ($)',
							value: investment,
							onChange: setInvestment,
						},
					].map(field => (
						<div key={field.label}>
							<label
								style={{
									fontSize: 11,
									color: 'var(--text-tertiary)',
									display: 'block',
									marginBottom: 4,
								}}
							>
								{field.label}
							</label>
							<input
								type='number'
								value={field.value}
								onChange={e => field.onChange(e.target.value)}
								style={{
									width: '100%',
									background: 'var(--bg-card)',
									border: '1px solid var(--border-primary)',
									borderRadius: 8,
									padding: '8px 10px',
									fontSize: 13,
									color: 'var(--text-primary)',
									outline: 'none',
									fontVariantNumeric: 'tabular-nums',
								}}
							/>
						</div>
					))}
				</div>

				{/* Results */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(4, 1fr)',
						gap: 8,
					}}
				>
					{[
						{
							label: 'Price ratio',
							value: `${priceRatio.toFixed(2)}x`,
							color: 'var(--text-primary)',
						},
						{
							label: 'Impermanent loss',
							value: formatIL(currentIL),
							color: severity.color,
						},
						{
							label: 'Dollar loss',
							value: `$${ilLoss.toFixed(2)}`,
							color: ilLoss > 0 ? 'var(--accent-red)' : 'var(--accent-green)',
						},
						{
							label: 'Fees to break even',
							value: `$${feesNeeded.toFixed(2)}`,
							color: 'var(--accent-amber)',
						},
					].map(stat => (
						<div
							key={stat.label}
							style={{
								background: 'var(--bg-primary)',
								borderRadius: 8,
								padding: '10px 12px',
								textAlign: 'center',
							}}
						>
							<p
								style={{
									fontSize: 11,
									color: 'var(--text-tertiary)',
									marginBottom: 4,
								}}
							>
								{stat.label}
							</p>
							<p style={{ fontSize: 14, fontWeight: 700, color: stat.color }}>
								{stat.value}
							</p>
						</div>
					))}
				</div>

				{/* Severity badge */}
				<div
					style={{
						marginTop: 10,
						display: 'flex',
						alignItems: 'center',
						gap: 8,
					}}
				>
					<span
						style={{
							fontSize: 11,
							fontWeight: 600,
							padding: '3px 10px',
							borderRadius: 20,
							background: `${severity.color}22`,
							color: severity.color,
							border: `1px solid ${severity.color}44`,
						}}
					>
						{severity.label} IL
					</span>
					<span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
						{Math.abs(currentIL) < 0.5
							? 'Price barely moved — IL is negligible'
							: Math.abs(currentIL) < 5
								? 'Small price movement — fees should cover this'
								: Math.abs(currentIL) < 15
									? 'Moderate IL — monitor your position'
									: 'High IL — consider rebalancing or closing position'}
					</span>
				</div>
			</div>

			{/* Current Uniswap positions IL */}
			{uniswapPositions.length > 0 && (
				<div>
					<p
						style={{
							fontSize: 11,
							fontWeight: 500,
							color: 'var(--text-tertiary)',
							textTransform: 'uppercase',
							letterSpacing: '0.06em',
							marginBottom: 10,
						}}
					>
						Your Uniswap positions
					</p>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
						{uniswapPositions.map(pos => {
							const t0Price = pos.token0.priceUSD || 1
							const t1Price = pos.token1.priceUSD || 1
							const mockInitialRatio = 1 + (pos.feesEarned / pos.valueUSD) * 0.5
							const posIL = ilPercent(mockInitialRatio)
							const posSev = ilSeverity(posIL)
							const posLoss = ilDollar(pos.valueUSD, mockInitialRatio)

							return (
								<div
									key={pos.id}
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										padding: '12px 14px',
										background: 'var(--bg-elevated)',
										borderRadius: 10,
										gap: 12,
									}}
								>
									<div
										style={{ display: 'flex', alignItems: 'center', gap: 10 }}
									>
										<span style={{ fontSize: 20 }}>🦄</span>
										<div>
											<p
												style={{
													fontSize: 13,
													fontWeight: 500,
													color: 'var(--text-primary)',
												}}
											>
												{pos.token0.symbol}/{pos.token1.symbol}
											</p>
											<p
												style={{ fontSize: 11, color: 'var(--text-tertiary)' }}
											>
												${t0Price.toFixed(2)} / ${t1Price.toFixed(2)}
											</p>
										</div>
									</div>

									<div style={{ textAlign: 'center' }}>
										<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
											Position value
										</p>
										<p
											style={{
												fontSize: 13,
												fontWeight: 600,
												color: 'var(--text-primary)',
											}}
										>
											${pos.valueUSD.toLocaleString()}
										</p>
									</div>

									<div style={{ textAlign: 'center' }}>
										<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
											Fees earned
										</p>
										<p
											style={{
												fontSize: 13,
												fontWeight: 600,
												color: 'var(--accent-green)',
											}}
										>
											+${pos.feesEarned.toFixed(2)}
										</p>
									</div>

									<div style={{ textAlign: 'right' }}>
										<span
											style={{
												fontSize: 12,
												fontWeight: 600,
												padding: '3px 10px',
												borderRadius: 20,
												background: `${posSev.color}22`,
												color: posSev.color,
											}}
										>
											{formatIL(posIL)} IL
										</span>
										<p
											style={{
												fontSize: 11,
												color: 'var(--text-tertiary)',
												marginTop: 2,
											}}
										>
											~${posLoss.toFixed(2)} loss
										</p>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			)}

			{/* Educational note */}
			<div
				style={{
					marginTop: 16,
					padding: '10px 14px',
					background: 'var(--accent-blue-glow)',
					border: '1px solid var(--border-accent)',
					borderRadius: 10,
					fontSize: 12,
					color: 'var(--text-secondary)',
					lineHeight: 1.6,
				}}
			>
				💡{' '}
				<strong style={{ color: 'var(--text-primary)' }}>
					Why "impermanent"?
				</strong>{' '}
				If prices return to the original ratio, the loss disappears. The loss
				only becomes permanent when you withdraw your liquidity at a different
				price ratio.
			</div>
		</div>
	)
}
