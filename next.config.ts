import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

const csp = [
	"default-src 'self'",
	isDev
		? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
		: "script-src 'self'",
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data: https: blob:",
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
		'https://generativelanguage.googleapis.com',
		'https://api.web3modal.org',
		'https://pulse.walletconnect.org',
		'https://relay.walletconnect.org',
		'wss://relay.walletconnect.org',
		'https://explorer-api.walletconnect.com',
		'wss://*.bridge.walletconnect.org',
		'wss://stream.binance.com:9443',
		'https://api.gopluslabs.io',
	].join(' '),
	"frame-ancestors 'none'",
	"base-uri 'self'",
	"form-action 'self'",
].join('; ')

const nextConfig: NextConfig = {
	// output: 'standalone',

	experimental: {
		optimizePackageImports: [
			'recharts',
			'@rainbow-me/rainbowkit',
			'wagmi',
			'viem',
			'@aave/contract-helpers',
			'@aave/math-utils',
		],
	},

	turbopack: {
		resolveAlias: {
			'@react-native-async-storage/async-storage': './src/lib/empty-module.ts',
			'pino-pretty': './src/lib/empty-module.ts',
			'pg-native': './src/lib/empty-module.ts',
			'ox/tempo': './src/lib/empty-module.ts',
		},
	},

	async headers() {
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
