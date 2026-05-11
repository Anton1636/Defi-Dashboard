import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			walletAddress?: string
			provider?: string
		} & DefaultSession['user']
	}

	interface User {
		walletAddress?: string
	}

	interface JWT {
		userId?: string
		walletAddress?: string
		provider?: string
	}
}
