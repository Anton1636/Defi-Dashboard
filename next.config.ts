import bundleAnalyzer from '@next/bundle-analyzer'
import type { NextConfig } from 'next'

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
})

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

const csp = [
	"default-src 'self'",
	isDev
		? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
		: "script-src 'self' 'unsafe-inline'",
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data: https: blob:",
	"font-src 'self' data:",
	[
		"connect-src 'self'",
		'https://api.geckoterminal.com',
		'https://gateway.thegraph.com',
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
		'https://api.tenderly.co',
		'https://api.gopluslabs.io',
	].join(' '),
	"frame-ancestors 'none'",
	"base-uri 'self'",
	"form-action 'self'",
].join('; ')

const nextConfig: NextConfig = {
	output: isProd ? 'standalone' : undefined,
	poweredByHeader: false,
	compress: true,
	productionBrowserSourceMaps: false,
	reactStrictMode: true,
	compiler: isProd
		? {
				removeConsole: {
					exclude: ['error', 'warn'],
				},
			}
		: {},

	experimental: {
		optimizePackageImports: [
			'recharts',
			'@rainbow-me/rainbowkit',
			'wagmi',
			'viem',
			'@aave/contract-helpers',
			'@aave/math-utils',
			'zustand',
		],
		typedRoutes: false,
	},

	turbopack: {
		resolveAlias: {
			'@react-native-async-storage/async-storage': './src/lib/empty-module.ts',
			'pino-pretty': './src/lib/empty-module.ts',
			'pg-native': './src/lib/empty-module.ts',
			'ox/tempo': './src/lib/empty-module.ts',
			ethers: './src/lib/empty-module.ts',
		},
	},

	webpack(config) {
		config.resolve.fallback = {
			...config.resolve.fallback,
			'@react-native-async-storage/async-storage': false,
			'pino-pretty': false,
			ethers: false,
		}
		return config
	},

	images: {
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 3600,
		remotePatterns: [
			{ protocol: 'https', hostname: '**.ens.domains' },
			{ protocol: 'https', hostname: 'ipfs.io' },
			{ protocol: 'https', hostname: '**.ipfs.dweb.link' },
			{ protocol: 'https', hostname: 'metadata.ens.domains' },
		],
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
			{
				source: '/static/(.*)',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
			{
				source: '/_next/static/(.*)',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
			{
				source: '/sw.js',
				headers: [
					{ key: 'Service-Worker-Allowed', value: '/' },
					{
						key: 'Cache-Control',
						value: 'no-cache, no-store, must-revalidate',
					},
				],
			},
		]
	},
}

export default withBundleAnalyzer(nextConfig)
