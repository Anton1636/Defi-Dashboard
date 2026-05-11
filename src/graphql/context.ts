import { prisma } from '@/lib/prisma'
import { auth } from '../../auth'
import type { NextRequest } from 'next/server'
import type { User } from '@prisma/client'

export interface GraphQLContext {
	prisma: typeof prisma
	user: User | null
	request: NextRequest
}

export async function createContext(
	request: NextRequest,
): Promise<GraphQLContext> {
	const session = await auth()

	let user: User | null = null

	if (session?.user?.email) {
		user = await prisma.user.findUnique({
			where: { email: session.user.email },
		})
	}

	return { prisma, user, request }
}
