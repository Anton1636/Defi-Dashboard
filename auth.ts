import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { SiweMessage } from 'siwe'
import { prisma } from '@/lib/prisma'
import { authConfig } from './auth.config'
import { verifyAndConsumeNonce } from '@/lib/nonce'
import type { User as NextAuthUser } from 'next-auth'

interface AuthUser extends NextAuthUser {
	walletAddress?: string
}

export const { auth, handlers, signIn, signOut } = NextAuth({
	...authConfig,

	secret: process.env.AUTH_SECRET,
	adapter: PrismaAdapter(prisma),

	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60,
	},

	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			authorization: {
				params: {
					scope: 'openid email profile',
					access_type: 'offline',
					response_type: 'code',
				},
			},
		}),

		Credentials({
			name: 'Ethereum Wallet',
			credentials: {
				message: { label: 'SIWE Message', type: 'text' },
				signature: { label: 'Signature', type: 'text' },
			},

			async authorize(credentials) {
				if (!credentials?.message || !credentials?.signature) return null

				try {
					// RainbowKit може передавати message як plain text або як JSON.
					// Пробуємо спочатку JSON.parse, якщо не вдалось — передаємо як є.
					let messageData: string | object
					try {
						messageData = JSON.parse(credentials.message as string)
					} catch {
						// RainbowKit-siwe передає вже готовий SIWE message рядок
						messageData = credentials.message as string
					}

					const siweMessage = new SiweMessage(messageData)

					const { data: fields } = await siweMessage.verify({
						signature: credentials.signature as string,
						domain: new URL(process.env.AUTH_URL ?? process.env.NEXTAUTH_URL!)
							.host,
						nonce: siweMessage.nonce,
					})

					const nonceValid = verifyAndConsumeNonce(siweMessage.nonce)
					if (!nonceValid) {
						console.info('[SIWE] RainbowKit CSRF nonce flow')
					}

					const walletAddress = fields.address.toLowerCase()

					const existingWallet = await prisma.wallet.findUnique({
						where: { address: walletAddress },
						include: { user: true },
					})

					if (existingWallet) {
						return {
							id: existingWallet.user.id,
							name: existingWallet.user.name,
							email: existingWallet.user.email,
							image: existingWallet.user.image,
							walletAddress,
						}
					}

					const newUser = await prisma.user.create({
						data: {
							name: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
							wallets: {
								create: {
									address: walletAddress,
									chainId: fields.chainId ?? 1,
									isPrimary: true,
								},
							},
						},
					})

					return {
						id: newUser.id,
						name: newUser.name,
						email: newUser.email,
						image: newUser.image,
						walletAddress,
					}
				} catch (error) {
					console.error('[SIWE] Auth failed:', error)
					return null
				}
			},
		}),
	],

	callbacks: {
		async jwt({ token, user, account, trigger }) {
			if (user) {
				const authUser = user as AuthUser
				token.userId = authUser.id as string
				token.walletAddress = authUser.walletAddress
			}
			if (account) {
				token.provider = account.provider
			}
			if (trigger === 'update' && token.userId) {
				const primaryWallet = await prisma.wallet.findFirst({
					where: { userId: token.userId as string, isPrimary: true },
				})
				token.walletAddress = primaryWallet?.address
			}
			return token
		},

		async session({ session, token }) {
			if (token) {
				session.user.id = token.userId as string
				session.user.walletAddress = token.walletAddress as string | undefined
				session.user.provider = token.provider as string | undefined
			}
			return session
		},
	},

	pages: {
		signIn: '/login',
		error: '/login',
	},
})
