import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

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
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
