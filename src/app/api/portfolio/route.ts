import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '../../../../auth'
import { getPortfolio } from '@/lib/defi/portfolio'
import { walletAddressSchema, validate } from '@/lib/security/validation'

export async function GET(request: NextRequest) {
	const session = await auth()
	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { searchParams } = new URL(request.url)
	const walletParam = searchParams.get('wallet')

	if (!walletParam) {
		return NextResponse.json(
			{ error: 'wallet parameter required' },
			{ status: 400 },
		)
	}

	let walletAddress: string
	try {
		walletAddress = validate(walletAddressSchema, walletParam)
	} catch {
		return NextResponse.json(
			{ error: 'Invalid wallet address' },
			{ status: 400 },
		)
	}

	try {
		const portfolio = await getPortfolio(walletAddress)
		return NextResponse.json(portfolio)
	} catch (error) {
		console.error('[API/portfolio]', error)
		return NextResponse.json(
			{ error: 'Failed to fetch portfolio' },
			{ status: 500 },
		)
	}
}
