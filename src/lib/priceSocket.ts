// Singleton WebSocket manager — Binance public stream (no API key needed)

export type PriceUpdate = {
	symbol: string
	price: number
	change24h: number
}

type Listener = (update: PriceUpdate) => void

const SYMBOL_MAP: Record<string, string> = {
	ETHUSDT: 'ETH',
	BTCUSDT: 'BTC',
	LINKUSDT: 'LINK',
	UNIUSDT: 'UNI',
	AAVEUSDT: 'AAVE',
	COMPUSDT: 'COMP',
	MATICUSDT: 'MATIC',
}

const STREAMS = Object.keys(SYMBOL_MAP)
	.map(s => `${s.toLowerCase()}@miniTicker`)
	.join('/')

const WS_URL = `wss://stream.binance.com:9443/stream?streams=${STREAMS}`

// Mock price data for NEXT_PUBLIC_USE_MOCK_DATA=true
const MOCK_BASE: Record<string, { price: number; change24h: number }> = {
	ETH: { price: 3245.5, change24h: 2.14 },
	BTC: { price: 67890.0, change24h: -0.87 },
	LINK: { price: 18.45, change24h: 3.21 },
	UNI: { price: 12.3, change24h: 1.05 },
	AAVE: { price: 187.2, change24h: -1.33 },
	COMP: { price: 89.5, change24h: 0.75 },
	MATIC: { price: 0.92, change24h: -0.44 },
}

class PriceSocketManager {
	private ws: WebSocket | null = null
	private listeners: Set<Listener> = new Set()
	private reconnectTimer: ReturnType<typeof setTimeout> | null = null
	private mockTimer: ReturnType<typeof setInterval> | null = null
	private shouldReconnect = false
	private mockPrices = structuredClone(MOCK_BASE)

	subscribe(listener: Listener) {
		this.listeners.add(listener)
		if (this.listeners.size === 1) this.connect()
		return () => {
			this.listeners.delete(listener)
			if (this.listeners.size === 0) this.disconnect()
		}
	}

	private emit(update: PriceUpdate) {
		this.listeners.forEach(fn => fn(update))
	}

	private startMock() {
		Object.entries(this.mockPrices).forEach(([symbol, data]) => {
			this.emit({ symbol, ...data })
		})

		this.mockTimer = setInterval(() => {
			const symbols = Object.keys(this.mockPrices)
			const count = Math.floor(Math.random() * 2) + 1
			for (let i = 0; i < count; i++) {
				const symbol = symbols[Math.floor(Math.random() * symbols.length)]
				const current = this.mockPrices[symbol]
				const delta = current.price * (Math.random() * 0.003 - 0.0015) // ±0.15%
				const newPrice = Math.max(current.price + delta, 0.01)
				const newChange = current.change24h + (Math.random() * 0.1 - 0.05)
				this.mockPrices[symbol] = { price: newPrice, change24h: newChange }
				this.emit({ symbol, price: newPrice, change24h: newChange })
			}
		}, 2000)
	}

	private connect() {
		if (typeof window === 'undefined') return
		this.shouldReconnect = true

		const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
		if (useMock) {
			this.startMock()
			return
		}

		try {
			this.ws = new WebSocket(WS_URL)

			this.ws.onmessage = event => {
				try {
					const { data } = JSON.parse(event.data)
					const symbol = SYMBOL_MAP[data?.s]
					if (!symbol) return
					this.emit({
						symbol,
						price: parseFloat(data.c),
						change24h: parseFloat(data.P),
					})
				} catch {}
			}

			this.ws.onclose = () => {
				if (this.shouldReconnect) {
					this.reconnectTimer = setTimeout(() => this.connect(), 3000)
				}
			}

			this.ws.onerror = () => {
				this.ws?.close()
			}
		} catch (e) {
			console.error('[PriceSocket] Failed to connect:', e)
			// Fallback to mock if WebSocket fails
			this.startMock()
		}
	}

	private disconnect() {
		this.shouldReconnect = false
		if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
		if (this.mockTimer) clearInterval(this.mockTimer)
		this.ws?.close()
		this.ws = null
	}
}

export const priceSocket = new PriceSocketManager()
