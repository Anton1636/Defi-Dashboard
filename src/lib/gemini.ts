import { GoogleGenerativeAI } from '@google/generative-ai'
import type {
	DeFiPosition,
	AavePosition,
	CompoundPosition,
	UniswapPosition,
} from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Models are tried in order, falling back to the next if one fails
const MODELS = [
	'gemini-3-flash-preview',
	'gemini-3.1-flash-lite-preview',
	'gemini-2.5-flash-lite',
]

export async function getGeminiStream(prompt: string) {
	let lastError: Error | null = null

	for (const modelName of MODELS) {
		try {
			const model = genAI.getGenerativeModel({
				model: modelName,
				generationConfig: {
					temperature: 0.7,
					maxOutputTokens: 1024,
				},
			})

			const result = await model.generateContentStream(prompt)

			console.info(`[Gemini] Using model: ${modelName}`)
			return { modelName, stream: result.stream }
		} catch (error) {
			console.warn(
				`[Gemini] Model ${modelName} failed, trying next...`,
				(error as Error).message,
			)
			lastError = error as Error
			continue
		}
	}

	throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`)
}

export function formatPositionsForPrompt(positions: DeFiPosition[]): string {
	if (positions.length === 0) {
		return 'The user has no active DeFi positions.'
	}

	return positions
		.map(pos => {
			if (pos.protocol === 'uniswap') {
				const p = pos as UniswapPosition
				return `
UNISWAP V3 POSITION:
- Pool: ${p.token0.symbol}/${p.token1.symbol}
- Value: $${p.valueUSD.toFixed(2)}
- Status: ${p.inRange ? 'In range (actively earning fees)' : 'Out of range (not earning fees)'}
- Fees earned: $${p.feesEarned.toFixed(2)}
- Token prices: ${p.token0.symbol} = $${p.token0.priceUSD.toFixed(2)}, ${p.token1.symbol} = $${p.token1.priceUSD.toFixed(2)}`
			}
			if (pos.protocol === 'aave') {
				const p = pos as AavePosition
				return `
AAVE V3 POSITION:
- Net worth: $${p.valueUSD.toFixed(2)}
- Health factor: ${p.healthFactor.toFixed(2)} (${p.healthFactor < 1.5 ? '⚠️ LIQUIDATION RISK' : p.healthFactor < 2 ? 'Monitor closely' : 'Safe'})
- Total collateral: $${p.totalCollateralUSD.toFixed(2)}
- Total debt: $${p.totalDebtUSD.toFixed(2)}
- Net APY: ${p.netAPY.toFixed(2)}%
- Supplied: ${p.supplies.map(s => `${s.symbol} $${s.valueUSD.toFixed(2)} at ${s.apy.toFixed(2)}% APY`).join(', ')}
- Borrowed: ${p.borrows.map(b => `${b.symbol} $${b.valueUSD.toFixed(2)} at ${b.apy.toFixed(2)}% APR`).join(', ')}`
			}
			if (pos.protocol === 'compound') {
				const p = pos as CompoundPosition
				return `
COMPOUND V3 POSITION:
- Market: ${p.market}
- Net value: $${p.valueUSD.toFixed(2)}
- Supplied: $${p.supplied.toFixed(2)} at ${p.supplyAPR.toFixed(2)}% APR
- Borrowed: ${p.borrowed > 0 ? `$${p.borrowed.toFixed(2)} at ${p.borrowAPR.toFixed(2)}% APR` : 'None'}`
			}
			return ''
		})
		.join('\n')
}

export function buildPortfolioPrompt(
	positions: DeFiPosition[],
	totalValueUSD: number,
	customQuestion?: string,
): string {
	const positionsText = formatPositionsForPrompt(positions)

	return `You are a DeFi portfolio advisor analyzing a user's positions.
Be concise, friendly, and use simple language. Avoid jargon when possible.
Always mention specific numbers and percentages from the data.

PORTFOLIO OVERVIEW:
- Total value: $${totalValueUSD.toFixed(2)}
- Number of positions: ${positions.length}
- Protocols used: ${[...new Set(positions.map(p => p.protocol))].join(', ')}

POSITIONS:
${positionsText}

${
	customQuestion
		? `USER QUESTION: ${customQuestion}

Please answer the user's specific question based on their portfolio data above.`
		: `Please provide:
1. **Portfolio Summary** - Brief overview of current positions (2-3 sentences)
2. **Key Risks** - Most important risks to be aware of right now
3. **Optimization Tips** - 2-3 specific actionable recommendations to improve yield or reduce risk
4. **Market Context** - Brief note on current DeFi market conditions affecting these positions

Keep total response under 400 words. Use **bold** for important terms.`
}`
}
