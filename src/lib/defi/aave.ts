import { GraphQLClient, gql } from 'graphql-request'
import type { AavePosition } from '@/types'

// Офіційний Aave V3 GraphQL API.
// Старий REST API (aave-api-v3.aave.com) більше не існує.
// Документація: https://aave.com/docs/aave-v3/getting-started/graphql
// Playground (можна тестувати запити): https://api.v3.aave.com/graphql
const AAVE_GRAPHQL = 'https://api.v3.aave.com/graphql'
const client = new GraphQLClient(AAVE_GRAPHQL)

// Запит для отримання позицій юзера.
// userReserves — всі резерви з якими юзер взаємодіяв.
// Фільтруємо по chainId: 1 (Ethereum mainnet).
const GET_USER_POSITIONS = gql`
	query GetUserPositions($user: EvmAddress!) {
		userReserves(where: { user: $user, chainId: 1 }) {
			reserve {
				symbol
				underlyingAsset
				liquidityRate
				variableBorrowRate
				priceInUSD
			}
			currentATokenBalance
			currentVariableDebt
			user {
				id
				healthFactor
				totalCollateralUSD
				totalDebtUSD
			}
		}
	}
`

interface AaveUserReserve {
	reserve: {
		symbol: string
		underlyingAsset: string
		liquidityRate: string
		variableBorrowRate: string
		priceInUSD: string
	}
	currentATokenBalance: string
	currentVariableDebt: string
	user: {
		id: string
		healthFactor: string
		totalCollateralUSD: string
		totalDebtUSD: string
	}
}

// Ray = 1e27 — одиниця виміру Aave для rates
// Конвертуємо в відсотки для UI
function rayToPercent(ray: string): number {
	return (parseFloat(ray) / 1e27) * 100
}

export async function getAavePositions(
	walletAddress: string,
): Promise<AavePosition[]> {
	try {
		const data = await client.request<{ userReserves: AaveUserReserve[] }>(
			GET_USER_POSITIONS,
			{ user: walletAddress.toLowerCase() },
		)

		if (!data.userReserves || data.userReserves.length === 0) return []

		// Розділяємо на supplies (депозити) і borrows (позики)
		const supplies = data.userReserves
			.filter(r => parseFloat(r.currentATokenBalance) > 0)
			.map(r => ({
				symbol: r.reserve.symbol,
				amount: parseFloat(r.currentATokenBalance),
				valueUSD:
					parseFloat(r.currentATokenBalance) * parseFloat(r.reserve.priceInUSD),
				apy: rayToPercent(r.reserve.liquidityRate),
			}))

		const borrows = data.userReserves
			.filter(r => parseFloat(r.currentVariableDebt) > 0)
			.map(r => ({
				symbol: r.reserve.symbol,
				amount: parseFloat(r.currentVariableDebt),
				valueUSD:
					parseFloat(r.currentVariableDebt) * parseFloat(r.reserve.priceInUSD),
				apy: rayToPercent(r.reserve.variableBorrowRate),
			}))

		// Якщо немає активних позицій — повертаємо порожній масив
		if (supplies.length === 0 && borrows.length === 0) return []

		// Беремо дані юзера з першого резерву (однакові для всіх)
		const userData = data.userReserves[0].user
		const totalCollateralUSD = parseFloat(userData.totalCollateralUSD)
		const totalDebtUSD = parseFloat(userData.totalDebtUSD)

		// Net APY — зважений APY по всіх позиціях
		const totalValue = totalCollateralUSD - totalDebtUSD
		const netAPY =
			totalValue > 0
				? supplies.reduce(
						(acc, s) => acc + (s.apy * s.valueUSD) / totalCollateralUSD,
						0,
					) -
					borrows.reduce(
						(acc, b) => acc + (b.apy * b.valueUSD) / totalDebtUSD,
						0,
					)
				: 0

		return [
			{
				protocol: 'aave' as const,
				chainId: 1,
				walletAddress,
				id: `aave-${walletAddress}`,
				valueUSD: totalValue,
				healthFactor: parseFloat(userData.healthFactor),
				totalCollateralUSD,
				totalDebtUSD,
				netAPY,
				supplies,
				borrows,
			},
		]
	} catch (error) {
		console.error('[Aave] Failed to fetch positions:', error)
		return []
	}
}
