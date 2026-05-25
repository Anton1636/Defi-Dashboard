'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import {
	RainbowKitProvider,
	darkTheme,
	type Theme,
} from '@rainbow-me/rainbowkit'
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth'
import type { GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth'
import { SessionProvider } from 'next-auth/react'
import { wagmiConfig } from '@/lib/wagmi'
import { getQueryClient } from '@/lib/query-client'

import '@rainbow-me/rainbowkit/styles.css'

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
	statement: 'Sign in to DeFi Dashboard. No transaction, no gas fee.',
})

const customTheme: Theme = {
	...darkTheme({
		accentColor: '#6366f1',
		accentColorForeground: 'white',
		borderRadius: 'large',
		fontStack: 'system',
		overlayBlur: 'small',
	}),
	colors: {
		...darkTheme().colors,
		modalBackground: '#16161f',
		modalBorder: 'rgba(255, 255, 255, 0.06)',
		modalText: '#f0f0ff',
		modalTextSecondary: '#8888aa',
		actionButtonBorder: 'rgba(255, 255, 255, 0.06)',
		actionButtonBorderMobile: 'rgba(255, 255, 255, 0.06)',
		closeButton: '#8888aa',
		closeButtonBackground: '#1e1e2a',
		connectButtonBackground: '#6366f1',
		connectButtonBackgroundError: '#ef4444',
		connectButtonInnerBackground: '#1e1e2a',
		connectButtonText: '#ffffff',
		connectionIndicator: '#10b981',
		downloadBottomCardBackground: '#16161f',
		downloadTopCardBackground: '#1e1e2a',
		error: '#ef4444',
		generalBorder: 'rgba(255, 255, 255, 0.06)',
		generalBorderDim: 'rgba(255, 255, 255, 0.03)',
		menuItemBackground: '#1e1e2a',
		profileAction: '#1e1e2a',
		profileActionHover: '#252535',
		profileForeground: '#16161f',
		selectedOptionBorder: 'rgba(99, 102, 241, 0.4)',
		standby: '#f59e0b',
	},
}

const queryClient = getQueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<WagmiProvider config={wagmiConfig}>
			<QueryClientProvider client={queryClient}>
				<SessionProvider>
					<RainbowKitSiweNextAuthProvider
						getSiweMessageOptions={getSiweMessageOptions}
					>
						<RainbowKitProvider theme={customTheme} locale='en-US'>
							{children}
						</RainbowKitProvider>
					</RainbowKitSiweNextAuthProvider>
				</SessionProvider>
			</QueryClientProvider>
		</WagmiProvider>
	)
}
