import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
	rainbowWallet,
	walletConnectWallet,
	coinbaseWallet,
	injectedWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { createConfig } from 'wagmi'
import {
	mainnet,
	arbitrum,
	base,
	optimism,
	polygon,
	sepolia,
} from 'wagmi/chains'
import { http } from 'wagmi'

const INFURA = process.env.NEXT_PUBLIC_INFURA_API_KEY

const connectors = connectorsForWallets(
	[
		{
			groupName: 'Recommended',
			wallets: [
				injectedWallet,
				rainbowWallet,
				coinbaseWallet,
				walletConnectWallet,
			],
		},
	],
	{
		appName: 'DeFi Dashboard',
		projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
	},
)

export const wagmiConfig = createConfig({
	connectors,

	chains: [mainnet, arbitrum, base, optimism, polygon, sepolia],

	transports: {
		[mainnet.id]: http(`https://mainnet.infura.io/v3/${INFURA}`),
		[arbitrum.id]: http(`https://arbitrum-mainnet.infura.io/v3/${INFURA}`),
		[base.id]: http(`https://base-mainnet.infura.io/v3/${INFURA}`),
		[optimism.id]: http(`https://optimism-mainnet.infura.io/v3/${INFURA}`),
		[polygon.id]: http(`https://polygon-mainnet.infura.io/v3/${INFURA}`),
		[sepolia.id]: http(`https://sepolia.infura.io/v3/${INFURA}`),
	},

	ssr: true,
})
