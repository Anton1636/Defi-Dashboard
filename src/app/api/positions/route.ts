import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '../../../../auth'
import { getUniswapPositions } from '@/lib/defi/uniswap'
import { getAavePositions } from '@/lib/defi/aave'
import { getCompoundPositions } from '@/lib/defi/compound'
import { getTokenPrice } from '@/lib/defi/coingecko'
import { walletAddressSchema, validate } from '@/lib/security/validation'

export async function GET(request: NextRequest) {
	// Auth перевірка — тільки залогінені можуть бачити позиції
	const session = await auth()
	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	// Читаємо wallet адресу з query параметрів
	const { searchParams } = new URL(request.url)
	const walletParam = searchParams.get('wallet')

	if (!walletParam) {
		return NextResponse.json(
			{ error: 'wallet parameter required' },
			{ status: 400 },
		)
	}

	// Валідуємо адресу через Zod — захист від некоректних даних
	let walletAddress: string
	try {
		walletAddress = validate(walletAddressSchema, walletParam)
	} catch {
		return NextResponse.json(
			{ error: 'Invalid wallet address' },
			{ status: 400 },
		)
	}

	// Фільтр по протоколу (опціональний)
	const protocol = searchParams.get('protocol')

	try {
		const ethPriceUSD = await getTokenPrice('ETH')

		// Паралельні запити до всіх трьох протоколів
		const [uniswap, aave, compound] = await Promise.allSettled([
			!protocol || protocol === 'uniswap'
				? getUniswapPositions(walletAddress, ethPriceUSD)
				: Promise.resolve([]),
			!protocol || protocol === 'aave'
				? getAavePositions(walletAddress)
				: Promise.resolve([]),
			!protocol || protocol === 'compound'
				? getCompoundPositions(walletAddress)
				: Promise.resolve([]),
		])

		const positions = [
			...(uniswap.status === 'fulfilled' ? uniswap.value : []),
			...(aave.status === 'fulfilled' ? aave.value : []),
			...(compound.status === 'fulfilled' ? compound.value : []),
		]

		return NextResponse.json({
			positions,
			count: positions.length,
			fetchedAt: new Date().toISOString(),
		})
	} catch (error) {
		console.error('[API/positions]', error)
		return NextResponse.json(
			{ error: 'Failed to fetch positions' },
			{ status: 500 },
		)
	}
}
