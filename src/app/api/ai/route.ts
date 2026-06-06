import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '@/lib/prisma'
import { buildPortfolioPrompt, getGeminiStream } from '@/lib/gemini'
import { getPortfolio } from '@/lib/defi/portfolio'
import { walletAddressSchema, validate } from '@/lib/security/validation'
import { z } from 'zod'
import type { Prisma } from '@prisma/client'

const aiRequestSchema = z.object({
	walletAddress: z.string(),
	question: z.string().max(500).optional(),
})

export async function POST(request: NextRequest) {
	const session = await auth()
	if (!session?.user?.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	let body: z.infer<typeof aiRequestSchema>
	try {
		body = aiRequestSchema.parse(await request.json())
	} catch {
		return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
	}

	let walletAddress: string
	try {
		walletAddress = validate(walletAddressSchema, body.walletAddress)
	} catch {
		return NextResponse.json(
			{ error: 'Invalid wallet address' },
			{ status: 400 },
		)
	}

	try {
		const portfolio = await getPortfolio(walletAddress)

		const prompt = buildPortfolioPrompt(
			portfolio.positions,
			portfolio.totalValueUSD,
			body.question,
		)

		const encoder = new TextEncoder()
		let fullResponse = ''

		const stream = new ReadableStream({
			async start(controller) {
				try {
					const { modelName, stream: geminiStream } =
						await getGeminiStream(prompt)

					for await (const chunk of geminiStream) {
						const text = chunk.text()
						if (text) {
							fullResponse += text
							controller.enqueue(
								encoder.encode(`data: ${JSON.stringify({ text })}\n\n`),
							)
						}
					}

					await prisma.aIAnalysis.create({
						data: {
							userId: session.user.id,
							prompt: body.question ?? 'Portfolio analysis',
							response: fullResponse,
							model: modelName,
							positionsCtx: JSON.parse(
								JSON.stringify(portfolio.positions),
							) as Prisma.InputJsonValue,
						},
					})

					controller.enqueue(
						encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`),
					)
					controller.close()
				} catch (error) {
					console.error('[AI] Streaming error:', error)
					controller.enqueue(
						encoder.encode(
							`data: ${JSON.stringify({ error: 'AI generation failed' })}\n\n`,
						),
					)
					controller.close()
				}
			},
		})

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache, no-transform',
				Connection: 'keep-alive',
				'X-Accel-Buffering': 'no',
			},
		})
	} catch (error) {
		console.error('[AI] Route error:', error)
		return NextResponse.json(
			{ error: 'Failed to generate analysis' },
			{ status: 500 },
		)
	}
}

// return history ai analyses from postgres
export async function GET(request: NextRequest) {
	const session = await auth()
	if (!session?.user?.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { searchParams } = new URL(request.url)
	const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 50)

	try {
		const analyses = await prisma.aIAnalysis.findMany({
			where: { userId: session.user.id },
			orderBy: { createdAt: 'desc' },
			take: limit,
			select: {
				id: true,
				prompt: true,
				response: true,
				model: true,
				createdAt: true,
			},
		})

		return NextResponse.json({ analyses })
	} catch (error) {
		console.error('[AI] GET error:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch history' },
			{ status: 500 },
		)
	}
}
