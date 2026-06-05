import { GraphQLError } from 'graphql'
import type { GraphQLContext } from '../context'

export const portfolioResolvers = {
	Query: {
		portfolio: async (
			_: unknown,
			{ _walletAddress }: { _walletAddress: string },
			ctx: GraphQLContext,
		) => {
			if (!ctx.user) {
				throw new GraphQLError('Not authenticated', {
					extensions: { code: 'UNAUTHENTICATED' },
				})
			}

			return {
				_walletAddress,
				totalValueUSD: 0,
				change24hPercent: 0,
				positions: [],
				lastUpdated: new Date().toISOString(),
			}
		},

		positions: async (
			_: unknown,
			_args: { _walletAddress: string },
			ctx: GraphQLContext,
		) => {
			if (!ctx.user) {
				throw new GraphQLError('Not authenticated', {
					extensions: { code: 'UNAUTHENTICATED' },
				})
			}
			return []
		},

		snapshots: async (
			_: unknown,
			{ limit = 30, offset = 0 }: { limit?: number; offset?: number },
			ctx: GraphQLContext,
		) => {
			if (!ctx.user) {
				throw new GraphQLError('Not authenticated', {
					extensions: { code: 'UNAUTHENTICATED' },
				})
			}

			return ctx.prisma.portfolioSnapshot.findMany({
				where: { userId: ctx.user.id },
				orderBy: { snapshotAt: 'desc' },
				take: Math.min(limit, 90),
				skip: offset,
			})
		},

		aiHistory: async (
			_: unknown,
			{ limit = 10 }: { limit?: number },
			ctx: GraphQLContext,
		) => {
			if (!ctx.user) {
				throw new GraphQLError('Not authenticated', {
					extensions: { code: 'UNAUTHENTICATED' },
				})
			}

			return ctx.prisma.aIAnalysis.findMany({
				where: { userId: ctx.user.id },
				orderBy: { createdAt: 'desc' },
				take: Math.min(limit, 50),
			})
		},

		alerts: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
			if (!ctx.user) {
				throw new GraphQLError('Not authenticated', {
					extensions: { code: 'UNAUTHENTICATED' },
				})
			}

			return ctx.prisma.alert.findMany({
				where: { userId: ctx.user.id },
				orderBy: { createdAt: 'desc' },
			})
		},
	},

	Mutation: {
		saveSnapshot: async (
			_: unknown,
			{ _walletAddress }: { _walletAddress: string },
			ctx: GraphQLContext,
		) => {
			if (!ctx.user) {
				throw new GraphQLError('Not authenticated', {
					extensions: { code: 'UNAUTHENTICATED' },
				})
			}

			const wallet = await ctx.prisma.wallet.findFirst({
				where: { address: _walletAddress, userId: ctx.user.id },
			})

			if (!wallet) {
				throw new GraphQLError('Wallet not found', {
					extensions: { code: 'NOT_FOUND' },
				})
			}

			return ctx.prisma.portfolioSnapshot.create({
				data: {
					userId: ctx.user.id,
					walletId: wallet.id,
					totalValue: 0,
					totalYield: 0,
					gasSpent: 0,
					positions: [],
					prices: {},
				},
			})
		},

		createAlert: async (
			_: unknown,
			{
				input,
			}: {
				input: {
					type: string
					threshold: number
					asset?: string
					protocol?: string
				}
			},
			ctx: GraphQLContext,
		) => {
			if (!ctx.user) {
				throw new GraphQLError('Not authenticated', {
					extensions: { code: 'UNAUTHENTICATED' },
				})
			}

			return ctx.prisma.alert.create({
				data: {
					userId: ctx.user.id,
					type: input.type as
						| 'PRICE_ABOVE'
						| 'PRICE_BELOW'
						| 'HEALTH_FACTOR_LOW'
						| 'YIELD_THRESHOLD',
					threshold: input.threshold,
					asset: input.asset,
					protocol: input.protocol,
				},
			})
		},

		deleteAlert: async (
			_: unknown,
			{ alertId }: { alertId: string },
			ctx: GraphQLContext,
		) => {
			if (!ctx.user) {
				throw new GraphQLError('Not authenticated', {
					extensions: { code: 'UNAUTHENTICATED' },
				})
			}

			await ctx.prisma.alert.deleteMany({
				where: { id: alertId, userId: ctx.user.id },
			})
			return true
		},

		analyzePortfolio: async (
			_: unknown,
			_args: { _walletAddress: string },
			ctx: GraphQLContext,
		) => {
			if (!ctx.user) {
				throw new GraphQLError('Not authenticated', {
					extensions: { code: 'UNAUTHENTICATED' },
				})
			}

			throw new GraphQLError('Not implemented yet', {
				extensions: { code: 'NOT_IMPLEMENTED' },
			})
		},
	},

	Position: {
		__resolveType(obj: { protocol: string }) {
			if (obj.protocol === 'UNISWAP') return 'UniswapPosition'
			if (obj.protocol === 'AAVE') return 'AavePosition'
			if (obj.protocol === 'COMPOUND') return 'CompoundPosition'
			return null
		},
	},
}
