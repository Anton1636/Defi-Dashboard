export const en = {
	nav: {
		portfolio: 'Portfolio',
		positions: 'Positions',
		analytics: 'Analytics',
		aiInsights: 'AI Insights',
		home: 'Home',
	},
	landing: {
		badge: 'Live across 6 chains',
		headline: 'Your DeFi portfolio,\nall in one place',
		subtitle:
			'Track positions across Uniswap, Aave and Compound. Real-time prices, AI insights, multi-chain support.',
		connectWallet: 'Connect Wallet',
		signIn: 'Sign In',
		signInGoogle: 'Sign in with Google',
		goToPortfolio: 'Go to Portfolio →',
		stats: {
			tvl: 'Total Value Locked',
			protocols: 'Active Protocols',
			volume: 'Daily Volume',
		},
		features: {
			title: 'Everything you need',
			multichain: {
				title: 'Multi-chain',
				desc: 'Track positions across Ethereum, Arbitrum, Base, Optimism, Polygon and more.',
			},
			realtime: {
				title: 'Real-time prices',
				desc: 'Live WebSocket price feeds from Binance. Flash animations on every tick.',
			},
			ai: {
				title: 'AI Insights',
				desc: 'Gemini-powered analysis of your portfolio. Ask anything about your positions.',
			},
		},
		footer: 'DeFi Dashboard · Built with Next.js, Prisma, RainbowKit',
	},
	portfolio: {
		title: 'Portfolio',
		totalValue: 'Total Portfolio Value',
		updated: 'Updated',
		across: 'across',
		protocols: 'protocols',
		openPositions: 'Open positions',
		bestApy: 'Best APY',
		network: 'Network',
		mainnet: 'Mainnet',
		openPositionsList: 'Open positions',
		total: 'total',
		assetAllocation: 'Asset allocation',
		noPositions: 'No DeFi positions found',
		noPositionsDesc:
			'Start by supplying assets to Aave or adding liquidity on Uniswap',
		notConnected: 'Track your DeFi portfolio',
		notConnectedDesc:
			'Connect your wallet to see positions across Uniswap, Aave and Compound',
	},
	positions: {
		title: 'Positions',
		openPositions: 'open positions',
		noPositions: 'No positions found',
	},
	analytics: {
		title: 'Analytics',
		subtitle:
			'Gas prices, optimization, transaction simulator and IL calculator',
		gasPrice: 'Gas Prices',
		gasSubtitle: 'Ethereum Mainnet · updates every 15s',
		slow: 'Slow',
		standard: 'Standard',
		fast: 'Fast',
		recommended: 'RECOMMENDED',
		baseFee: 'Base fee',
		updated: 'Updated',
		suggestions: '💡 Optimization Suggestions',
	},
	aiInsights: {
		title: 'AI Insights',
		subtitle: 'Powered by Gemini',
		analyze: 'Analyze Now',
		analyzing: 'Analyzing...',
		askPlaceholder: 'Ask about your portfolio...',
	},
	common: {
		loading: 'Loading...',
		error: 'Error',
		signOut: 'Sign out',
		openDashboard: 'Open Dashboard →',
		swap: 'swap',
		yearly: 'yearly',
		inRange: 'In range',
		outOfRange: 'Out of range',
		healthy: 'Healthy',
		atRisk: 'At risk',
		unlimited: 'Unlimited',
		lastUsed: 'Last used',
	},
	mode: {
		pro: 'PRO',
		simple: 'SIMPLE',
	},
}

export type TranslationKeys = typeof en
