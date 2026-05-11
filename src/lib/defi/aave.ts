import { GraphQLClient, gql } from 'graphql-request'
import type { AavePosition } from '@/types'

const AAVE_GRAPHQL = 'https://api.v3.aave.com/graphql'
const client = new GraphQLClient(AAVE_GRAPHQL)

// Правильні query fields згідно офіційної документації:
// userSupplies — депозити юзера
// userBorrows  — позики юзера
// Документація: https://aave.com/docs/aave-v3/markets/positions
const GET_USER_SUPPLIES = gql`
	query GetUserSupplies($user: EvmAddress!, $chainId: Int!) {
		userSupplies(user: $user, markets: [{ chainId: $chainId }]) {
			reserve {
				symbol
				underlyingAsset
				liquidityRate
				priceInUSD
			}
			underlyingBalance
			underlyingBalanceUSD
		}
	}
`

const GET_USER_BORROWS = gql`
	query GetUserBorrows($user: EvmAddress!, $chainId: Int!) {
		userBorrows(user: $user, markets: [{ chainId: $chainId }]) {
			reserve {
				symbol
				underlyingAsset
				variableBorrowRate
				priceInUSD
			}
			variableBorrows
			variableBorrowsUSD
		}
	}
`

const GET_USER_HEALTH = gql`
	query GetUserHealth(
		$market: EvmAddress!
		$user: EvmAddress!
		$chainId: ChainId!
	) {
		userMarketState(market: $market, user: $user, chainId: $chainId) {
			healthFactor
			netWorth
		}
	}
`

// Aave V3 Pool address на Ethereum mainnet
const AAVE_V3_POOL = '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2'

interface SupplyItem {
	reserve: {
		symbol: string
		underlyingAsset: string
		liquidityRate: string
		priceInUSD: string
	}
	underlyingBalance: string
	underlyingBalanceUSD: string
}

interface BorrowItem {
	reserve: {
		symbol: string
		underlyingAsset: string
		variableBorrowRate: string
		priceInUSD: string
	}
	variableBorrows: string
	variableBorrowsUSD: string
}

// Ray = 1e27 — одиниця виміру Aave для rates
function rayToPercent(ray: string): number {
	return (parseFloat(ray) / 1e27) * 100
}

export async function getAavePositions(
	walletAddress: string,
): Promise<AavePosition[]> {
	try {
		const user = walletAddress.toLowerCase() as `0x${string}`

		// Запускаємо всі три запити паралельно
		const [suppliesData, borrowsData, healthData] = await Promise.allSettled([
			client.request<{ userSupplies: SupplyItem[] }>(GET_USER_SUPPLIES, {
				user,
				chainId: 1,
			}),
			client.request<{ userBorrows: BorrowItem[] }>(GET_USER_BORROWS, {
				user,
				chainId: 1,
			}),
			client.request<{
				userMarketState: { healthFactor: string; netWorth: string }
			}>(GET_USER_HEALTH, {
				market: AAVE_V3_POOL,
				user,
				chainId: 1,
			}),
		])

		const supplies =
			suppliesData.status === 'fulfilled'
				? (suppliesData.value.userSupplies ?? [])
				: []

		const borrows =
			borrowsData.status === 'fulfilled'
				? (borrowsData.value.userBorrows ?? [])
				: []

		const healthFactor =
			healthData.status === 'fulfilled'
				? parseFloat(healthData.value.userMarketState?.healthFactor ?? '999')
				: 999

		const netWorth =
			healthData.status === 'fulfilled'
				? parseFloat(healthData.value.userMarketState?.netWorth ?? '0')
				: 0

		// Немає позицій — повертаємо порожній масив
		if (supplies.length === 0 && borrows.length === 0) return []

		const suppliesMapped = supplies.map(s => ({
			symbol: s.reserve.symbol,
			amount: parseFloat(s.underlyingBalance),
			valueUSD: parseFloat(s.underlyingBalanceUSD),
			apy: rayToPercent(s.reserve.liquidityRate),
		}))

		const borrowsMapped = borrows.map(b => ({
			symbol: b.reserve.symbol,
			amount: parseFloat(b.variableBorrows),
			valueUSD: parseFloat(b.variableBorrowsUSD),
			apy: rayToPercent(b.reserve.variableBorrowRate),
		}))

		const totalCollateralUSD = suppliesMapped.reduce(
			(sum, s) => sum + s.valueUSD,
			0,
		)
		const totalDebtUSD = borrowsMapped.reduce((sum, b) => sum + b.valueUSD, 0)

		// Net APY — зважений APY
		const netAPY =
			totalCollateralUSD > 0
				? suppliesMapped.reduce(
						(acc, s) => acc + (s.apy * s.valueUSD) / totalCollateralUSD,
						0,
					) -
					(totalDebtUSD > 0
						? borrowsMapped.reduce(
								(acc, b) => acc + (b.apy * b.valueUSD) / totalDebtUSD,
								0,
							)
						: 0)
				: 0

		return [
			{
				id: `aave-${walletAddress}`,
				protocol: 'aave' as const,
				chainId: 1,
				walletAddress,
				valueUSD: netWorth || totalCollateralUSD - totalDebtUSD,
				healthFactor,
				totalCollateralUSD,
				totalDebtUSD,
				netAPY,
				supplies: suppliesMapped,
				borrows: borrowsMapped,
			},
		]
	} catch (error) {
		console.error('[Aave] Failed to fetch positions:', error)
		return []
	}
}
