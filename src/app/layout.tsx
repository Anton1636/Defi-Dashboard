import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
})

export const metadata: Metadata = {
	title: 'DeFi Dashboard',
	description: 'Track your DeFi portfolio across Uniswap, Aave and Compound',
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
			<body className='bg-background text-foreground antialiased'>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
