'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth'
import type { GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth'
import { SessionProvider } from 'next-auth/react'
import { wagmiConfig } from '@/lib/wagmi'
import { getQueryClient } from '@/lib/query-client'

import '@rainbow-me/rainbowkit/styles.css'

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
	statement: 'Sign in to DeFi Dashboard. No transaction, no gas fee.',
})

export function Providers({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient()

	return (
		<WagmiProvider config={wagmiConfig}>
			<QueryClientProvider client={queryClient}>
				<SessionProvider>
					<RainbowKitSiweNextAuthProvider
						getSiweMessageOptions={getSiweMessageOptions}
					>
						<RainbowKitProvider
							theme={lightTheme({
								accentColor: '#2563EB',
								accentColorForeground: 'white',
								borderRadius: 'large',
							})}
							locale='en-US'
						>
							{children}
						</RainbowKitProvider>
					</RainbowKitSiweNextAuthProvider>
				</SessionProvider>
			</QueryClientProvider>
		</WagmiProvider>
	)
}
