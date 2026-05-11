import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '@/lib/prisma'
import { getPortfolio } from '@/lib/defi/portfolio'
import { walletAddressSchema, validate } from '@/lib/security/validation'

export async function POST(request: NextRequest) {
	const session = await auth()
	if (!session?.user?.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = await request.json()

	let walletAddress: string
	try {
		walletAddress = validate(walletAddressSchema, body.walletAddress)
	} catch {
		return NextResponse.json(
			{ error: 'Invalid wallet address' },
			{ status: 400 },
		)
	}

	const wallet = await prisma.wallet.findFirst({
		where: { address: walletAddress, userId: session.user.id },
	})

	if (!wallet) {
		return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
	}

	try {
		const portfolio = await getPortfolio(walletAddress)
		const snapshot = await prisma.portfolioSnapshot.create({
			data: {
				userId: session.user.id,
				walletId: wallet.id,
				totalValue: portfolio.totalValueUSD,
				totalYield: 0,
				gasSpent: 0,
				// positions save as JSON for analytics
				positions: JSON.parse(JSON.stringify(portfolio.positions)),
				prices: {},
			},
		})

		return NextResponse.json({
			id: snapshot.id,
			totalValue: Number(snapshot.totalValue),
			snapshotAt: snapshot.snapshotAt,
		})
	} catch (error) {
		console.error('[API/snapshots POST]', error)
		return NextResponse.json(
			{ error: 'Failed to save snapshot' },
			{ status: 500 },
		)
	}
}

// GET — returns historical snapshots for analytics charts
export async function GET(request: NextRequest) {
	const session = await auth()
	if (!session?.user?.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { searchParams } = new URL(request.url)
	const limit = Math.min(parseInt(searchParams.get('limit') ?? '30'), 90)

	try {
		const snapshots = await prisma.portfolioSnapshot.findMany({
			where: { userId: session.user.id },
			orderBy: { snapshotAt: 'desc' },
			take: limit,
			select: {
				id: true,
				totalValue: true,
				totalYield: true,
				snapshotAt: true,
			},
		})

		const formatted = snapshots.map(s => ({
			id: s.id,
			totalValue: Number(s.totalValue),
			totalYield: Number(s.totalYield),
			snapshotAt: s.snapshotAt.toISOString(),
		}))

		return NextResponse.json({ snapshots: formatted })
	} catch (error) {
		console.error('[API/snapshots GET]', error)
		return NextResponse.json(
			{ error: 'Failed to fetch snapshots' },
			{ status: 500 },
		)
	}
}
