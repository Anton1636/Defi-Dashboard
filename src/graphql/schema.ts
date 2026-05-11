import { gql } from 'graphql-tag'

export const typeDefs = gql`
	# ─── Scalar types ────────────────────────────────────────────────────────────
	# JSON —  JSONB PostgreSQL (positions, prices)
	# DateTime — ISO 8601
	scalar JSON
	scalar DateTime

	# ─── Enums ───────────────────────────────────────────────────────────────────
	enum Protocol {
		UNISWAP
		AAVE
		COMPOUND
	}

	enum AlertType {
		PRICE_ABOVE
		PRICE_BELOW
		HEALTH_FACTOR_LOW
		YIELD_THRESHOLD
	}

	# ─── Core types ──────────────────────────────────────────────────────────────

	type User {
		id: ID!
		email: String
		name: String
		image: String
		wallets: [Wallet!]!
		createdAt: DateTime!
	}

	type Wallet {
		id: ID!
		address: String!
		chainId: Int!
		label: String
		isPrimary: Boolean!
		createdAt: DateTime!
	}

	# ─── DeFi Position types ─────────────────────────────────────────────────────

	interface Position {
		id: ID!
		protocol: Protocol!
		valueUSD: Float!
		walletAddress: String!
	}

	type Token {
		address: String!
		symbol: String!
		decimals: Int!
		priceUSD: Float!
	}

	type UniswapPosition implements Position {
		id: ID!
		protocol: Protocol!
		valueUSD: Float!
		walletAddress: String!
		poolId: String!
		token0: Token!
		token1: Token!
		feesEarned: Float!
		inRange: Boolean!
	}

	type AaveAsset {
		symbol: String!
		amount: Float!
		valueUSD: Float!
		apy: Float!
	}

	type AavePosition implements Position {
		id: ID!
		protocol: Protocol!
		valueUSD: Float!
		walletAddress: String!
		healthFactor: Float!
		totalCollateralUSD: Float!
		totalDebtUSD: Float!
		netAPY: Float!
		supplies: [AaveAsset!]!
		borrows: [AaveAsset!]!
	}

	type CompoundPosition implements Position {
		id: ID!
		protocol: Protocol!
		valueUSD: Float!
		walletAddress: String!
		market: String!
		supplied: Float!
		borrowed: Float!
		supplyAPR: Float!
		borrowAPR: Float!
	}

	# ─── Portfolio ────────────────────────────────────────────────────────────────
	type Portfolio {
		walletAddress: String!
		totalValueUSD: Float!
		change24hPercent: Float!
		positions: [Position!]!
		lastUpdated: DateTime!
	}

	# ─── Historical data (з PostgreSQL) ──────────────────────────────────────────
	type PortfolioSnapshot {
		id: ID!
		totalValue: Float!
		totalYield: Float!
		gasSpent: Float!
		positions: JSON!
		snapshotAt: DateTime!
	}

	type AIAnalysis {
		id: ID!
		prompt: String!
		response: String!
		model: String!
		createdAt: DateTime!
	}

	type Alert {
		id: ID!
		type: AlertType!
		threshold: Float!
		asset: String
		protocol: String
		isActive: Boolean!
		triggered: Boolean!
		createdAt: DateTime!
	}

	# ─── Input types (для mutations) ─────────────────────────────────────────────
	input ConnectWalletInput {
		address: String!
		signature: String!
		message: String!
		chainId: Int!
	}

	input CreateAlertInput {
		type: AlertType!
		threshold: Float!
		asset: String
		protocol: String
	}

	# ─── Queries ─────────────────────────────────────────────────────────────────
	type Query {
		me: User

		portfolio(walletAddress: String!): Portfolio

		positions(walletAddress: String!, protocol: Protocol): [Position!]!

		# Historical snapshots з PostgreSQL
		snapshots(limit: Int, offset: Int): [PortfolioSnapshot!]!

		# AI analysis history
		aiHistory(limit: Int): [AIAnalysis!]!

		alerts: [Alert!]!
	}

	# ─── Mutations ───────────────────────────────────────────────────────────────
	type Mutation {
		connectWallet(input: ConnectWalletInput!): Wallet!

		disconnectWallet(walletId: ID!): Boolean!

		saveSnapshot(walletAddress: String!): PortfolioSnapshot!

		analyzePortfolio(walletAddress: String!): AIAnalysis!

		createAlert(input: CreateAlertInput!): Alert!
		deleteAlert(alertId: ID!): Boolean!
	}
`
