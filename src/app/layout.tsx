import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'
import { ServiceWorkerRegistration } from '@/components/pwa/ServiceWorkerRegistration'
import { OfflineBanner } from '@/components/pwa/OfflineBanner'
import { PWAInstallBanner } from '@/components/pwa/PWAInstallBanner'

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
})

export const metadata: Metadata = {
	title: 'NEXORA — Liquidity Galaxy',
	description:
		'Navigate your DeFi capital across Uniswap, Aave and Compound. Orbital visualization, AI signals, real-time intelligence.',
	keywords: [
		'DeFi',
		'portfolio',
		'Uniswap',
		'Aave',
		'Compound',
		'blockchain',
		'liquidity',
	],
	manifest: '/manifest.json',
	appleWebApp: {
		capable: true,
		statusBarStyle: 'black-translucent',
		title: 'NEXORA',
	},
	icons: {
		apple: '/icons/icon-192.png',
	},
}

export const viewport: Viewport = {
	themeColor: '#05060a',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en' className={inter.variable} suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								try {
									var t = localStorage.getItem('defi-theme') ||
										(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
									document.documentElement.setAttribute('data-theme', t);
								} catch(e) {}
							})();
						`,
					}}
				/>
			</head>
			<body className={inter.variable}>
				<ServiceWorkerRegistration />
				<OfflineBanner />
				<Providers>{children}</Providers>
				<PWAInstallBanner />
			</body>
		</html>
	)
}
