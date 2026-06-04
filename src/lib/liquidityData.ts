export interface TickBucket {
	priceMin: number
	priceMax: number
	priceMid: number
	liquidity: number // 0-1 normalized
	inRange: boolean
	isYourLP: boolean
}

export interface LiquidityMapData {
	buckets: TickBucket[]
	currentPrice: number
	yourLow: number
	yourHigh: number
	pair: string
	feeTier: string
	peakZone: { min: number; max: number }
}

function seededRand(seed: number) {
	const x = Math.sin(seed + 1) * 10000
	return x - Math.floor(x)
}

// Gaussian distribution centered on price
function gaussian(x: number, mean: number, std: number) {
	return Math.exp(-0.5 * Math.pow((x - mean) / std, 2))
}

export function generateLiquidityData(
	currentPrice: number,
	yourLow: number,
	yourHigh: number,
	pair: string = 'ETH/USDC',
	feeTier: string = '0.3%',
	buckets: number = 30,
): LiquidityMapData {
	const rangeMin = currentPrice * 0.65
	const rangeMax = currentPrice * 1.45
	const step = (rangeMax - rangeMin) / buckets

	const result: TickBucket[] = []
	let maxLiq = 0

	// Generate raw liquidity with multiple peaks
	const rawLiqs: number[] = []
	for (let i = 0; i < buckets; i++) {
		const mid = rangeMin + (i + 0.5) * step
		// Primary peak near current price
		const primary = gaussian(mid, currentPrice, currentPrice * 0.08)
		// Secondary peak slightly above
		const secondary =
			gaussian(mid, currentPrice * 1.05, currentPrice * 0.04) * 0.6
		// Noise
		const noise = seededRand(mid * 0.001 + i * 3.7) * 0.08
		const liq = primary + secondary + noise
		rawLiqs.push(liq)
		if (liq > maxLiq) maxLiq = liq
	}

	// Normalize and build buckets
	for (let i = 0; i < buckets; i++) {
		const priceMin = rangeMin + i * step
		const priceMax = priceMin + step
		const priceMid = (priceMin + priceMax) / 2
		const liquidity = rawLiqs[i] / maxLiq

		result.push({
			priceMin,
			priceMax,
			priceMid: Math.round(priceMid * 100) / 100,
			liquidity: Math.round(liquidity * 1000) / 1000,
			inRange: priceMid >= yourLow && priceMid <= yourHigh,
			isYourLP: priceMid >= yourLow && priceMid <= yourHigh,
		})
	}

	// Find peak zone (top 20% liquidity buckets)
	const threshold = 0.75
	const peakBuckets = result.filter(b => b.liquidity >= threshold)
	const peakZone = {
		min: peakBuckets.length
			? Math.min(...peakBuckets.map(b => b.priceMin))
			: currentPrice * 0.95,
		max: peakBuckets.length
			? Math.max(...peakBuckets.map(b => b.priceMax))
			: currentPrice * 1.05,
	}

	return {
		buckets: result,
		currentPrice,
		yourLow,
		yourHigh,
		pair,
		feeTier,
		peakZone,
	}
}

export function getLiquidityColor(liquidity: number, inRange: boolean): string {
	if (inRange) {
		const alpha = 0.15 + liquidity * 0.7
		return `rgba(74,222,128,${alpha.toFixed(2)})`
	}
	const alpha = 0.08 + liquidity * 0.45
	return `rgba(0,209,255,${alpha.toFixed(2)})`
}

export function formatPrice(p: number): string {
	if (p >= 10000) return `$${(p / 1000).toFixed(1)}K`
	if (p >= 1000) return `$${(p / 1000).toFixed(2)}K`
	return `$${p.toFixed(0)}`
}
