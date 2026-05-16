import {
	mainnet,
	arbitrum,
	base,
	optimism,
	polygon,
	sepolia,
} from 'viem/chains'

export interface ChainConfig {
	id: number
	name: string
	shortName: string
	icon: string
	color: string
	glow: string
	rpcUrl: string
	explorerUrl: string
	nativeCurrency: string
	isTestnet: boolean
	supportedProtocols: ('uniswap' | 'aave' | 'compound')[]
}

export const CHAINS: Record<number, ChainConfig> = {
	// Ethereum Mainnet
	[mainnet.id]: {
		id: mainnet.id,
		name: 'Ethereum',
		shortName: 'ETH',
		icon: '⟠',
		color: '#627EEA',
		glow: 'rgba(98, 126, 234, 0.15)',
		rpcUrl: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
		explorerUrl: 'https://etherscan.io',
		nativeCurrency: 'ETH',
		isTestnet: false,
		supportedProtocols: ['uniswap', 'aave', 'compound'],
	},

	// Arbitrum One
	[arbitrum.id]: {
		id: arbitrum.id,
		name: 'Arbitrum',
		shortName: 'ARB',
		icon: '🔵',
		color: '#2D374B',
		glow: 'rgba(45, 55, 75, 0.3)',
		rpcUrl: `https://arbitrum-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
		explorerUrl: 'https://arbiscan.io',
		nativeCurrency: 'ETH',
		isTestnet: false,
		supportedProtocols: ['uniswap', 'aave'],
	},

	// Base — Coinbase L2
	[base.id]: {
		id: base.id,
		name: 'Base',
		shortName: 'BASE',
		icon: '🔷',
		color: '#0052FF',
		glow: 'rgba(0, 82, 255, 0.15)',
		rpcUrl: `https://base-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
		explorerUrl: 'https://basescan.org',
		nativeCurrency: 'ETH',
		isTestnet: false,
		supportedProtocols: ['uniswap', 'aave'],
	},

	// Optimism
	[optimism.id]: {
		id: optimism.id,
		name: 'Optimism',
		shortName: 'OP',
		icon: '🔴',
		color: '#FF0420',
		glow: 'rgba(255, 4, 32, 0.15)',
		rpcUrl: `https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
		explorerUrl: 'https://optimistic.etherscan.io',
		nativeCurrency: 'ETH',
		isTestnet: false,
		supportedProtocols: ['uniswap', 'aave'],
	},

	// Polygon
	[polygon.id]: {
		id: polygon.id,
		name: 'Polygon',
		shortName: 'MATIC',
		icon: '🟣',
		color: '#8247E5',
		glow: 'rgba(130, 71, 229, 0.15)',
		rpcUrl: `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
		explorerUrl: 'https://polygonscan.com',
		nativeCurrency: 'MATIC',
		isTestnet: false,
		supportedProtocols: ['uniswap', 'aave'],
	},

	[sepolia.id]: {
		id: sepolia.id,
		name: 'Sepolia',
		shortName: 'SEP',
		icon: '🔬',
		color: '#6366f1',
		glow: 'rgba(99, 102, 241, 0.15)',
		rpcUrl: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
		explorerUrl: 'https://sepolia.etherscan.io',
		nativeCurrency: 'ETH',
		isTestnet: true,
		supportedProtocols: ['uniswap'],
	},
}

export const SUPPORTED_CHAIN_IDS = Object.keys(CHAINS).map(Number)

export function getChainConfig(chainId: number): ChainConfig {
	return CHAINS[chainId] ?? CHAINS[mainnet.id]
}

export function isProtocolSupported(
	chainId: number,
	protocol: 'uniswap' | 'aave' | 'compound',
): boolean {
	return CHAINS[chainId]?.supportedProtocols.includes(protocol) ?? false
}
