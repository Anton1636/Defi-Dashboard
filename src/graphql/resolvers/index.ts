import { userResolvers } from './user.resolver'
import { portfolioResolvers } from './portfolio.resolver'

export const resolvers = {
	Query: {
		...userResolvers.Query,
		...portfolioResolvers.Query,
	},
	Mutation: {
		...userResolvers.Mutation,
		...portfolioResolvers.Mutation,
	},
	// Interface resolver
	Position: portfolioResolvers.Position,
}
