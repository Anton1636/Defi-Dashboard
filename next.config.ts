import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	output: 'standalone',

	turbopack: {
		resolveAlias: {
			'@react-native-async-storage/async-storage': './src/lib/empty-module.ts',
			'pino-pretty': './src/lib/empty-module.ts',
			'pg-native': './src/lib/empty-module.ts',
		},
	},

	async headers() {
		const isDev = process.env.NODE_ENV === 'development'

		const csp = [
			"default-src 'self'",
			isDev
				? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
				: "script-src 'self'",
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' data: https:",
			"font-src 'self' data:",
			[
				"connect-src 'self'",
				'https://api.thegraph.com',
				'https://mainnet.infura.io',
				'https://arbitrum-mainnet.infura.io',
				'https://base-mainnet.infura.io',
				'https://optimism-mainnet.infura.io',
				'https://polygon-mainnet.infura.io',
				'https://sepolia.infura.io',
				'wss://mainnet.infura.io',
				'wss://arbitrum-mainnet.infura.io',
				'https://generativelanguage.googleapis.com',
				'https://api.web3modal.org',
				'https://pulse.walletconnect.org',
				'https://relay.walletconnect.org',
				'wss://relay.walletconnect.org',
				'https://explorer-api.walletconnect.com',
				'wss://*.bridge.walletconnect.org',
			].join(' '),
			"img-src 'self' data: https: blob:",
			"frame-ancestors 'none'",
			"base-uri 'self'",
			"form-action 'self'",
		].join('; ')

		return [
			{
				source: '/(.*)',
				headers: [
					{ key: 'X-Frame-Options', value: 'DENY' },
					{ key: 'X-Content-Type-Options', value: 'nosniff' },
					{ key: 'X-DNS-Prefetch-Control', value: 'on' },
					{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
					{
						key: 'Permissions-Policy',
						value: 'camera=(), microphone=(), geolocation=()',
					},
					{
						key: 'Strict-Transport-Security',
						value: 'max-age=63072000; includeSubDomains; preload',
					},
					{ key: 'Content-Security-Policy', value: csp },
				],
			},
		]
	},
}

export default nextConfig
