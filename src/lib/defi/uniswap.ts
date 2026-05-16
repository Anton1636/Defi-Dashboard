import { GraphQLClient, gql } from 'graphql-request'
import type { UniswapPosition } from '@/types'

const UNISWAP_SUBGRAPH = `https://gateway.thegraph.com/api/${process.env.THE_GRAPH_API_KEY}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`

const client = new GraphQLClient(UNISWAP_SUBGRAPH, {
	fetch: (url, options) => {
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 8000)
		return fetch(url, { ...options, signal: controller.signal }).finally(() =>
			clearTimeout(timeoutId),
		)
	},
})

const GET_POSITIONS = gql`
	query GetPositions($owner: String!) {
		positions(
			where: { owner: $owner, liquidity_gt: "0" }
			orderBy: id
			orderDirection: desc
			first: 20
		) {
			id
			liquidity
			depositedToken0
			depositedToken1
			withdrawnToken0
			withdrawnToken1
			collectedFeesToken0
			collectedFeesToken1
			pool {
				id
				feeTier
				sqrtPrice
				tick
				token0Price
				token1Price
			}
			token0 {
				id
				symbol
				decimals
				derivedETH
			}
			token1 {
				id
				symbol
				decimals
				derivedETH
			}
			tickLower {
				tickIdx
				price0
				price1
			}
			tickUpper {
				tickIdx
				price0
				price1
			}
		}
	}
`

interface UniswapSubgraphPosition {
	id: string
	liquidity: string
	depositedToken0: string
	depositedToken1: string
	collectedFeesToken0: string
	collectedFeesToken1: string
	pool: {
		id: string
		feeTier: string
		tick: string
		token0Price: string
		token1Price: string
	}
	token0: {
		id: string
		symbol: string
		decimals: string
		derivedETH: string
	}
	token1: {
		id: string
		symbol: string
		decimals: string
		derivedETH: string
	}
	tickLower: { tickIdx: string; price0: string }
	tickUpper: { tickIdx: string; price0: string }
}

export async function getUniswapPositions(
	walletAddress: string,
	ethPriceUSD: number,
): Promise<UniswapPosition[]> {
	try {
		const data = await client.request<{ positions: UniswapSubgraphPosition[] }>(
			GET_POSITIONS,
			{ owner: walletAddress.toLowerCase() },
		)

		return data.positions.map(pos => {
			const currentTick = parseInt(pos.pool.tick)
			const tickLower = parseInt(pos.tickLower.tickIdx)
			const tickUpper = parseInt(pos.tickUpper.tickIdx)

			// Позиція "in range" якщо поточна ціна між tickLower і tickUpper.
			// Out of range = не заробляє fees.
			const inRange = currentTick >= tickLower && currentTick <= tickUpper

			// Розраховуємо вартість позиції в USD через ціну ETH
			const token0ValueETH =
				parseFloat(pos.depositedToken0) * parseFloat(pos.token0.derivedETH)
			const token1ValueETH =
				parseFloat(pos.depositedToken1) * parseFloat(pos.token1.derivedETH)
			const valueUSD = (token0ValueETH + token1ValueETH) * ethPriceUSD

			// Fees earned — зібрані комісії з торгів в цьому пулі
			const feesEarned =
				(parseFloat(pos.collectedFeesToken0) *
					parseFloat(pos.token0.derivedETH) +
					parseFloat(pos.collectedFeesToken1) *
						parseFloat(pos.token1.derivedETH)) *
				ethPriceUSD

			return {
				protocol: 'uniswap' as const,
				chainId: 1,
				walletAddress,
				id: pos.id,
				poolId: pos.pool.id,
				valueUSD,
				inRange,
				feesEarned,
				token0: {
					address: pos.token0.id,
					symbol: pos.token0.symbol,
					decimals: parseInt(pos.token0.decimals),
					priceUSD: parseFloat(pos.token0.derivedETH) * ethPriceUSD,
				},
				token1: {
					address: pos.token1.id,
					symbol: pos.token1.symbol,
					decimals: parseInt(pos.token1.decimals),
					priceUSD: parseFloat(pos.token1.derivedETH) * ethPriceUSD,
				},
			}
		})
	} catch (error) {
		console.error('[Uniswap] Failed to fetch positions:', error)
		return []
	}
}
