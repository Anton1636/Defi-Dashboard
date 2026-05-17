'use client'

import { useTokenPrice } from '@/hooks/usePrices'

interface PriceTickerProps {
	symbol: string
	showChange?: boolean
	showSymbol?: boolean
	size?: 'sm' | 'md' | 'lg'
}

function formatPrice(price: number): string {
	if (price >= 1000)
		return price.toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})
	if (price >= 1) return price.toFixed(4)
	return price.toFixed(6)
}

export function PriceTicker({
	symbol,
	showChange = true,
	showSymbol = false,
	size = 'sm',
}: PriceTickerProps) {
	const data = useTokenPrice(symbol)

	const fontSize = size === 'lg' ? 16 : size === 'md' ? 14 : 12

	if (!data) {
		return (
			<span
				style={{
					fontSize,
					color: 'var(--text-tertiary)',
					fontVariantNumeric: 'tabular-nums',
				}}
			>
				{showSymbol && `${symbol} `}—
			</span>
		)
	}

	const { price, change24h, flash } = data
	const isUp = change24h >= 0

	const priceColor =
		flash === 'up'
			? 'var(--accent-green)'
			: flash === 'down'
				? 'var(--accent-red)'
				: 'var(--text-primary)'

	return (
		<span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
			{showSymbol && (
				<span
					style={{
						fontSize: fontSize - 1,
						color: 'var(--text-tertiary)',
						fontWeight: 500,
					}}
				>
					{symbol}
				</span>
			)}
			<span
				style={{
					fontSize,
					fontWeight: 600,
					color: priceColor,
					transition: 'color 0.4s ease',
					fontVariantNumeric: 'tabular-nums',
				}}
			>
				${formatPrice(price)}
			</span>
			{showChange && (
				<span
					style={{
						fontSize: fontSize - 1,
						color: isUp ? 'var(--accent-green)' : 'var(--accent-red)',
						fontWeight: 500,
					}}
				>
					{isUp ? '↑' : '↓'}
					{Math.abs(change24h).toFixed(2)}%
				</span>
			)}
		</span>
	)
}
