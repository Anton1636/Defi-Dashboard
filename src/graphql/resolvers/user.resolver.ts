import { GraphQLError } from 'graphql'
import type { GraphQLContext } from '../context'

export const userResolvers = {
	Query: {
		me: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
			if (!ctx.user) {
				throw new GraphQLError('Not authenticated', {
					extensions: { code: 'UNAUTHENTICATED' },
				})
			}

			return ctx.prisma.user.findUnique({
				where: { id: ctx.user.id },
				include: { wallets: true },
			})
		},
	},

	Mutation: {
		disconnectWallet: async (
			_: unknown,
			{ walletId }: { walletId: string },
			ctx: GraphQLContext,
		) => {
			if (!ctx.user) {
				throw new GraphQLError('Not authenticated', {
					extensions: { code: 'UNAUTHENTICATED' },
				})
			}

			const wallet = await ctx.prisma.wallet.findFirst({
				where: { id: walletId, userId: ctx.user.id },
			})

			if (!wallet) {
				throw new GraphQLError('Wallet not found', {
					extensions: { code: 'NOT_FOUND' },
				})
			}

			await ctx.prisma.wallet.delete({ where: { id: walletId } })
			return true
		},
	},
}
