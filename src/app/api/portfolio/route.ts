import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '../../../../auth'
import { getPortfolio } from '@/lib/defi/portfolio'
import { walletAddressSchema, validate } from '@/lib/security/validation'
import { SUPPORTED_CHAIN_IDS } from '@/lib/chains'

export async function GET(request: NextRequest) {
	const session = await auth()
	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { searchParams } = new URL(request.url)
	const walletParam = searchParams.get('wallet')
	// chainId from query params, default Ethereum mainnet (1)
	const chainIdParam = parseInt(searchParams.get('chainId') ?? '1')

	if (!walletParam) {
		return NextResponse.json(
			{ error: 'wallet parameter required' },
			{ status: 400 },
		)
	}

	// validate chainId
	if (!SUPPORTED_CHAIN_IDS.includes(chainIdParam)) {
		return NextResponse.json(
			{ error: `Unsupported chainId: ${chainIdParam}` },
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
		const portfolio = await getPortfolio(walletAddress, chainIdParam)
		return NextResponse.json(portfolio)
	} catch (error) {
		console.error('[API/portfolio]', error)
		return NextResponse.json(
			{ error: 'Failed to fetch portfolio' },
			{ status: 500 },
		)
	}
}
