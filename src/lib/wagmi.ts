import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import {
	mainnet,
	arbitrum,
	base,
	optimism,
	polygon,
	sepolia,
} from 'wagmi/chains'
import { http } from 'wagmi'

export const wagmiConfig = getDefaultConfig({
	appName: 'DeFi Dashboard',
	projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

	chains: [mainnet, arbitrum, base, optimism, polygon, sepolia],

	transports: {
		[mainnet.id]: http(
			`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
		),
		[arbitrum.id]: http(
			`https://arbitrum-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
		),
		[base.id]: http(
			`https://base-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
		),
		[optimism.id]: http(
			`https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
		),
		[polygon.id]: http(
			`https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
		),
		[sepolia.id]: http(
			`https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
		),
	},
	ssr: true,
})
