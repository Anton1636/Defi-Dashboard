// CoinGecko API — безкоштовний, без API ключа для базових запитів.
// Використовуємо для отримання поточних цін токенів в USD.
// Rate limit: 10-30 запитів/хвилину на безкоштовному tier.

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'

// Маппінг символів токенів на CoinGecko IDs
// CoinGecko використовує власні ID замість символів
const TOKEN_ID_MAP: Record<string, string> = {
	ETH: 'ethereum',
	WETH: 'weth',
	USDC: 'usd-coin',
	USDT: 'tether',
	DAI: 'dai',
	WBTC: 'wrapped-bitcoin',
	LINK: 'chainlink',
	UNI: 'uniswap',
	AAVE: 'aave',
	COMP: 'compound-governance-token',
}

export interface TokenPrice {
	symbol: string
	priceUSD: number
	change24h: number
}

// Отримуємо ціни для масиву токенів одним запитом
export async function getTokenPrices(
	symbols: string[],
): Promise<Record<string, TokenPrice>> {
	// Конвертуємо символи в CoinGecko IDs
	const ids = symbols
		.map(s => TOKEN_ID_MAP[s.toUpperCase()])
		.filter(Boolean)
		.join(',')

	if (!ids) return {}

	try {
		const response = await fetch(
			`${COINGECKO_BASE}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
			{
				// next: { revalidate: 60 } — Next.js кешує відповідь на 60 секунд.
				// Не робимо новий запит до CoinGecko при кожному page load —
				// це захищає від rate limit і прискорює відповідь.
				next: { revalidate: 60 },
			},
		)

		if (!response.ok) throw new Error('CoinGecko API error')

		const data = await response.json()

		// Конвертуємо відповідь назад в символи
		const result: Record<string, TokenPrice> = {}
		symbols.forEach(symbol => {
			const id = TOKEN_ID_MAP[symbol.toUpperCase()]
			if (id && data[id]) {
				result[symbol.toUpperCase()] = {
					symbol: symbol.toUpperCase(),
					priceUSD: data[id].usd ?? 0,
					change24h: data[id].usd_24h_change ?? 0,
				}
			}
		})

		return result
	} catch (error) {
		console.error('[CoinGecko] Failed to fetch prices:', error)
		return {}
	}
}

// Отримати ціну одного токена
export async function getTokenPrice(symbol: string): Promise<number> {
	const prices = await getTokenPrices([symbol])
	return prices[symbol.toUpperCase()]?.priceUSD ?? 0
}
