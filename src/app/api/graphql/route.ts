import { createYoga } from 'graphql-yoga'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { typeDefs } from '@/graphql/schema'
import { resolvers } from '@/graphql/resolvers'
import { createContext } from '@/graphql/context'
import { graphqlRequestSchema, validate } from '@/lib/security/validation'
import type { NextRequest } from 'next/server'

const schema = makeExecutableSchema({ typeDefs, resolvers })

const yoga = createYoga({
	schema,
	context: ctx => createContext(ctx.request as NextRequest),
	graphqlEndpoint: '/api/graphql',
	graphiql: process.env.NODE_ENV === 'development',
	fetchAPI: { Response, Request },
})

export async function GET(request: NextRequest) {
	return yoga.fetch(request)
}

export async function POST(request: NextRequest) {
	try {
		// Клонуємо запит щоб прочитати body для валідації
		// (body можна прочитати тільки один раз)
		const cloned = request.clone()
		const body = await cloned.json()

		// Валідуємо GraphQL запит через Zod
		// Захист від надто великих запитів і introspection в production
		validate(graphqlRequestSchema, body)
	} catch (error) {
		return new Response(
			JSON.stringify({
				errors: [{ message: (error as Error).message }],
			}),
			{
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			},
		)
	}

	return yoga.fetch(request)
}

export async function OPTIONS(request: NextRequest) {
	return yoga.fetch(request)
}
