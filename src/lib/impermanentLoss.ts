export function calculateIL(priceRatio: number): number {
	if (priceRatio <= 0) return 0
	return (2 * Math.sqrt(priceRatio)) / (1 + priceRatio) - 1
}

export function ilPercent(priceRatio: number): number {
	return calculateIL(priceRatio) * 100
}

export function ilDollar(initialValueUSD: number, priceRatio: number): number {
	return initialValueUSD * Math.abs(calculateIL(priceRatio))
}

export function feesToBreakEven(
	initialValueUSD: number,
	priceRatio: number,
): number {
	return ilDollar(initialValueUSD, priceRatio)
}

export function generateILCurve(
	points = 200,
): { ratio: number; il: number; label: string }[] {
	return Array.from({ length: points }, (_, i) => {
		const ratio = 0.05 + (i / (points - 1)) * 9.95 // 0.05x → 10x
		return {
			ratio: parseFloat(ratio.toFixed(3)),
			il: parseFloat(ilPercent(ratio).toFixed(4)),
			label: `${ratio.toFixed(2)}x`,
		}
	})
}

export function v3ConcentrationMultiplier(
	lowerTick: number,
	upperTick: number,
): number {
	const range = upperTick - lowerTick
	if (range <= 0) return 1
	return Math.max(1, Math.min(20, 200 / range))
}

export function formatIL(il: number): string {
	if (Math.abs(il) < 0.01) return '~0%'
	return `${il.toFixed(2)}%`
}

// Severity label
export function ilSeverity(ilPct: number): {
	label: string
	color: string
} {
	const abs = Math.abs(ilPct)
	if (abs < 1) return { label: 'Negligible', color: 'var(--accent-green)' }
	if (abs < 5) return { label: 'Low', color: 'var(--accent-green)' }
	if (abs < 15) return { label: 'Moderate', color: 'var(--accent-amber)' }
	if (abs < 30) return { label: 'High', color: '#f97316' }
	return { label: 'Severe', color: 'var(--accent-red)' }
}
