export type Protocol = 'uniswap' | 'aave' | 'compound'

export interface Token {
	address: string
	symbol: string
	decimals: number
	priceUSD: number
}

export interface BasePosition {
	id: string
	protocol: Protocol
	chainId: number
	walletAddress: string
	valueUSD: number
}

export interface UniswapPosition extends BasePosition {
	protocol: 'uniswap'
	poolId: string
	token0: Token
	token1: Token
	feesEarned: number
	inRange: boolean
}

export interface AavePosition extends BasePosition {
	protocol: 'aave'
	healthFactor: number
	totalCollateralUSD: number
	totalDebtUSD: number
	netAPY: number
	supplies: AaveAsset[]
	borrows: AaveAsset[]
}

export interface CompoundPosition extends BasePosition {
	protocol: 'compound'
	market: string
	supplied: number
	borrowed: number
	supplyAPR: number
	borrowAPR: number
}

export interface AaveAsset {
	symbol: string
	amount: number
	valueUSD: number
	apy: number
}

export type DeFiPosition = UniswapPosition | AavePosition | CompoundPosition

export interface Portfolio {
	walletAddress: string
	totalValueUSD: number
	change24hPercent: number
	positions: DeFiPosition[]
	lastUpdated: string
}

export interface JWTPayload {
	sub: string
	email?: string
	wallet?: string
	iat: number
	exp: number
}

export interface TokenPrice {
	symbol: string
	priceUSD: number
	change24h: number
}
