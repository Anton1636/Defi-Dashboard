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
		1: http(`https://mainnet.infura.io/v3/${INFURA}`),
		42161: http(`https://arbitrum-mainnet.infura.io/v3/${INFURA}`),
		8453: http(`https://base-mainnet.infura.io/v3/${INFURA}`),
		10: http(`https://optimism-mainnet.infura.io/v3/${INFURA}`),
		137: http(`https://polygon-mainnet.infura.io/v3/${INFURA}`),
		11155111: http(`https://sepolia.infura.io/v3/${INFURA}`),
	},

	ssr: true,
})
