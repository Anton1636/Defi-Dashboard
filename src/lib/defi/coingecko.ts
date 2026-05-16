import type { TokenPrice } from '@/types'

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'

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
	ARB: 'arbitrum',
	OP: 'optimism',
	MATIC: 'matic-network',
}

async function fetchWithTimeout(
	url: string,
	options: RequestInit = {},
	timeoutMs = 5000,
): Promise<Response> {
	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

	try {
		return await fetch(url, {
			...options,
			signal: controller.signal,
		})
	} finally {
		clearTimeout(timeoutId)
	}
}

export async function getTokenPrices(
	symbols: string[],
): Promise<Record<string, TokenPrice>> {
	const ids = symbols
		.map(s => TOKEN_ID_MAP[s.toUpperCase()])
		.filter(Boolean)
		.join(',')

	if (!ids) return {}

	try {
		const response = await fetchWithTimeout(
			`${COINGECKO_BASE}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
			{
				next: { revalidate: 60 },
			},
			5000,
		)

		if (!response.ok) throw new Error(`CoinGecko error: ${response.status}`)

		const data = await response.json()

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
		if (error instanceof Error && error.name === 'AbortError') {
			console.warn('[CoinGecko] Timed out after 5s — returning empty prices')
		} else {
			console.error('[CoinGecko] Failed:', error)
		}
		return {}
	}
}

export async function getTokenPrice(symbol: string): Promise<number> {
	const prices = await getTokenPrices([symbol])
	return prices[symbol.toUpperCase()]?.priceUSD ?? 0
}
