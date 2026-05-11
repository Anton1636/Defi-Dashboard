import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

export const authConfig: NextAuthConfig = {
	secret: process.env.AUTH_SECRET,
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],

	pages: {
		signIn: '/login',
		error: '/login',
	},

	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isAuthenticated = !!auth?.user
			const pathname = nextUrl.pathname

			const PROTECTED = [
				'/portfolio',
				'/positions',
				'/analytics',
				'/ai-insights',
			]
			const AUTH_ONLY = ['/login']

			const isProtected = PROTECTED.some(p => pathname.startsWith(p))
			const isAuthOnly = AUTH_ONLY.some(p => pathname.startsWith(p))

			if (isProtected && !isAuthenticated) return false

			if (isAuthOnly && isAuthenticated) {
				return Response.redirect(new URL('/portfolio', nextUrl))
			}

			return true
		},
	},
}
