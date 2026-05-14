import { GoogleGenerativeAI } from '@google/generative-ai'
import type {
	DeFiPosition,
	AavePosition,
	CompoundPosition,
	UniswapPosition,
} from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const geminiModel = genAI.getGenerativeModel({
	model: 'gemini-1.5-flash',
	generationConfig: {
		temperature: 0.7,
		maxOutputTokens: 1024,
	},
})

function formatPositionsForPrompt(positions: DeFiPosition[]): string {
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
- Supplied assets: ${p.supplies.map(s => `${s.symbol} $${s.valueUSD.toFixed(2)} at ${s.apy.toFixed(2)}% APY`).join(', ')}
- Borrowed assets: ${p.borrows.map(b => `${b.symbol} $${b.valueUSD.toFixed(2)} at ${b.apy.toFixed(2)}% APR`).join(', ')}`
			}

			if (pos.protocol === 'compound') {
				const p = pos as CompoundPosition
				return `
COMPOUND V3 POSITION:
- Market: ${p.market}
- Net value: $${p.valueUSD.toFixed(2)}
- Supplied: $${p.supplied.toFixed(2)} at ${p.supplyAPR.toFixed(2)}% APR
- Borrowed: $${p.borrowed > 0 ? `$${p.borrowed.toFixed(2)} at ${p.borrowAPR.toFixed(2)}% APR` : 'None'}`
			}

			return `UNKNOWN POSITION: ${JSON.stringify(pos)}`
		})
		.join('\n')
}

// Prompt for analyzing a user's DeFi portfolio and providing insights and recommendations.
export function buildPortfolioPrompt(
	positions: DeFiPosition[],
	totalValueUSD: number,
	customQuestion?: string,
): string {
	const positionsText = formatPositionsForPrompt(positions)

	const basePrompt = `You are a DeFi portfolio advisor analyzing a user's positions. 
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
}
`

	return basePrompt
}
