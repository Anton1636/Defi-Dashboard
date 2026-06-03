export type TimeRange = '24H' | '7D' | '30D' | '90D' | '1Y' | 'ALL'

export interface ChartPoint {
	timestamp: number
	value: number
	label: string
}

export interface ProtocolSeries {
	name: string
	color: string
	data: ChartPoint[]
}

function seededRand(seed: number) {
	const x = Math.sin(seed + 1) * 10000
	return x - Math.floor(x)
}

function generateSeries(
	base: number,
	points: number,
	volatility: number,
	trend: number,
	seedOffset: number,
): number[] {
	const result: number[] = []
	let v = base
	for (let i = 0; i < points; i++) {
		const noise = (seededRand(seedOffset + i * 13.7) - 0.5) * volatility
		v = v * (1 + trend + noise)
		result.push(Math.max(v, base * 0.3))
	}
	return result
}

function makeLabels(range: TimeRange, points: number): string[] {
	const labels: string[] = []
	const now = Date.now()

	const intervalMs: Record<TimeRange, number> = {
		'24H': 3_600_000,
		'7D': 6 * 3_600_000,
		'30D': 24 * 3_600_000,
		'90D': 3 * 24 * 3_600_000,
		'1Y': 7 * 24 * 3_600_000,
		ALL: 14 * 24 * 3_600_000,
	}

	const interval = intervalMs[range]
	for (let i = points - 1; i >= 0; i--) {
		const ts = now - i * interval
		const d = new Date(ts)
		let label = ''
		if (range === '24H') {
			label = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
		} else if (range === '7D') {
			label = d.toLocaleDateString([], { weekday: 'short', hour: '2-digit' })
		} else {
			label = d.toLocaleDateString([], { month: 'short', day: 'numeric' })
		}
		labels.push(label)
	}
	return labels
}

const RANGE_CONFIG: Record<
	TimeRange,
	{ points: number; volatility: number; trend: number }
> = {
	'24H': { points: 24, volatility: 0.012, trend: 0.001 },
	'7D': { points: 28, volatility: 0.018, trend: 0.002 },
	'30D': { points: 30, volatility: 0.025, trend: 0.003 },
	'90D': { points: 45, volatility: 0.03, trend: 0.004 },
	'1Y': { points: 52, volatility: 0.04, trend: 0.005 },
	ALL: { points: 60, volatility: 0.05, trend: 0.006 },
}

export function generatePortfolioChartData(
	totalValue: number,
	range: TimeRange,
): ChartPoint[] {
	const cfg = RANGE_CONFIG[range]
	const labels = makeLabels(range, cfg.points)
	const base = totalValue * 0.72
	const vals = generateSeries(
		base,
		cfg.points,
		cfg.volatility,
		cfg.trend,
		totalValue,
	)

	// Last point = current value
	vals[vals.length - 1] = totalValue

	return vals.map((value, i) => ({
		timestamp: i,
		value: Math.round(value * 100) / 100,
		label: labels[i],
	}))
}

export function generateProtocolSeries(
	positions: { protocol: string; valueUSD: number }[],
	range: TimeRange,
): ProtocolSeries[] {
	const cfg = RANGE_CONFIG[range]

	const PROTOCOL_COLORS: Record<string, string> = {
		uniswap: '#ff007a',
		aave: '#7b61ff',
		compound: '#00d395',
	}

	return positions.map((pos, idx) => {
		const labels = makeLabels(range, cfg.points)
		const base = pos.valueUSD * 0.75
		const vals = generateSeries(
			base,
			cfg.points,
			cfg.volatility * 1.2,
			cfg.trend,
			pos.valueUSD + idx * 1000,
		)
		vals[vals.length - 1] = pos.valueUSD

		return {
			name:
				pos.protocol.charAt(0).toUpperCase() + pos.protocol.slice(1) + ' V3',
			color: PROTOCOL_COLORS[pos.protocol] ?? '#888',
			data: vals.map((value, i) => ({
				timestamp: i,
				value: Math.round(value * 100) / 100,
				label: labels[i],
			})),
		}
	})
}

export function calcChange(data: ChartPoint[]): { value: number; pct: number } {
	if (data.length < 2) return { value: 0, pct: 0 }
	const first = data[0].value
	const last = data[data.length - 1].value
	return {
		value: last - first,
		pct: ((last - first) / first) * 100,
	}
}
