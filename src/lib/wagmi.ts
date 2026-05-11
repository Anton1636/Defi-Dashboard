import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, sepolia } from 'wagmi/chains'
import { http } from 'wagmi'

export const wagmiConfig = getDefaultConfig({
	appName: 'DeFi Dashboard',

	projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

	chains: [mainnet, sepolia],
	transports: {
		[mainnet.id]: http(
			`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
		),
		[sepolia.id]: http(
			`https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
		),
	},
	ssr: true,
})
