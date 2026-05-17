'use client'

import { useId } from 'react'

// ─── Seeded deterministic random ─────────────────────────────────────────────
// Produces the same sparkline for the same seed (position.id, etc.)
function seededRand(seed: string) {
	let h = seed
		.split('')
		.reduce((acc, c) => (Math.imul(31, acc) + c.charCodeAt(0)) | 0, 0)
	return () => {
		h ^= h << 13
		h ^= h >> 17
		h ^= h << 5
		return (h >>> 0) / 0x100000000
	}
}

export function generateSparkData(seed: string, points = 7): number[] {
	const rand = seededRand(seed)
	const data: number[] = []
	let v = 100
	for (let i = 0; i < points; i++) {
		// Slight upward bias (0.47 instead of 0.5) for realistic DeFi look
		v += (rand() - 0.47) * 20
		data.push(Math.max(v, 5))
	}
	return data
}

// ─── Sparkline component ──────────────────────────────────────────────────────
interface SparklineProps {
	data: number[]
	width?: number
	height?: number
	/** Override auto color (auto = green if up, red if down) */
	color?: string
	filled?: boolean
}

export function Sparkline({
	data,
	width = 80,
	height = 32,
	color,
	filled = true,
}: SparklineProps) {
	const uid = useId()
	// Replace colons so the id is valid in SVG/HTML
	const gradId = `spk-${uid.replace(/:/g, 'x')}`

	if (!data || data.length < 2) return null

	const min = Math.min(...data)
	const max = Math.max(...data)
	const range = max - min || 1
	const isUp = data[data.length - 1] >= data[0]

	const strokeColor =
		color ?? (isUp ? 'var(--accent-green)' : 'var(--accent-red)')
	const rawColor = isUp ? '#10b981' : '#ef4444'

	const PAD = 3
	const W = width - PAD * 2
	const H = height - PAD * 2

	const pts = data.map((val, i) => ({
		x: PAD + (i / (data.length - 1)) * W,
		y: PAD + H - ((val - min) / range) * H,
	}))

	// Smooth cubic bezier path
	const linePath = pts.reduce((acc, pt, i) => {
		if (i === 0) return `M ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`
		const prev = pts[i - 1]
		const cx = ((prev.x + pt.x) / 2).toFixed(2)
		return `${acc} C ${cx} ${prev.y.toFixed(2)}, ${cx} ${pt.y.toFixed(2)}, ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`
	}, '')

	const last = pts[pts.length - 1]
	const first = pts[0]
	const fillPath = `${linePath} L ${last.x.toFixed(2)} ${(PAD + H).toFixed(2)} L ${first.x.toFixed(2)} ${(PAD + H).toFixed(2)} Z`

	return (
		<svg
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			style={{ overflow: 'visible', flexShrink: 0, display: 'block' }}
			aria-hidden='true'
		>
			{filled && (
				<defs>
					<linearGradient id={gradId} x1='0' y1='0' x2='0' y2='1'>
						<stop offset='0%' stopColor={rawColor} stopOpacity='0.28' />
						<stop offset='100%' stopColor={rawColor} stopOpacity='0' />
					</linearGradient>
				</defs>
			)}
			{filled && <path d={fillPath} fill={`url(#${gradId})`} />}
			<path
				d={linePath}
				fill='none'
				stroke={strokeColor}
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			{/* Last point dot */}
			<circle cx={last.x} cy={last.y} r='2.5' fill={strokeColor} />
		</svg>
	)
}
