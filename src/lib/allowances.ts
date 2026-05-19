export type RiskLevel = 'low' | 'medium' | 'high'

export interface TokenAllowance {
	id: string
	token: string
	tokenAddress: string
	spender: string
	spenderAddress: string
	amount: string
	isUnlimited: boolean
	riskLevel: RiskLevel
	riskReason: string
	lastActivity: string
	isKnownProtocol: boolean
}

export interface AllowanceSummary {
	total: number
	high: number
	medium: number
	low: number
	scannedAt: Date
}

// const KNOWN_PROTOCOLS: Record<string, string> = {
// 	'0xE592427A0AEce92De3Edee1F18E0157C05861564': 'Uniswap V3 Router',
// 	'0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45': 'Uniswap V3 Router 2',
// 	'0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D': 'Uniswap V2 Router',
// 	'0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2': 'Aave V3 Pool',
// 	'0x1111111254EEB25477B68fb85Ed929f73A960582': '1inch Router V5',
// 	'0xDef1C0ded9bec7F1a1670819833240f027b25EfF': '0x Exchange Proxy',
// 	'0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD': 'Uniswap Universal Router',
// }

// Mock
function getMockAllowances(address: string): TokenAllowance[] {
	return [
		{
			id: '1',
			token: 'USDC',
			tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
			spender: 'Uniswap V3 Router',
			spenderAddress: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
			amount: 'Unlimited',
			isUnlimited: true,
			riskLevel: 'medium',
			riskReason: 'Unlimited approval to known protocol',
			lastActivity: '2 days ago',
			isKnownProtocol: true,
		},
		{
			id: '2',
			token: 'DAI',
			tokenAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
			spender: 'Aave V3 Pool',
			spenderAddress: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
			amount: 'Unlimited',
			isUnlimited: true,
			riskLevel: 'low',
			riskReason: 'Trusted protocol, actively used',
			lastActivity: '1 day ago',
			isKnownProtocol: true,
		},
		{
			id: '3',
			token: 'USDC',
			tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
			spender: '1inch Router V5',
			spenderAddress: '0x1111111254EEB25477B68fb85Ed929f73A960582',
			amount: '10,000 USDC',
			isUnlimited: false,
			riskLevel: 'low',
			riskReason: 'Limited amount to known aggregator',
			lastActivity: '5 days ago',
			isKnownProtocol: true,
		},
		{
			id: '4',
			token: 'WETH',
			tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
			spender: 'Unknown Contract',
			spenderAddress: `0x${address?.slice(2, 10) ?? 'deadbeef'}cafe1234`,
			amount: 'Unlimited',
			isUnlimited: true,
			riskLevel: 'high',
			riskReason: 'Unlimited approval to unverified contract',
			lastActivity: '45 days ago',
			isKnownProtocol: false,
		},
		{
			id: '5',
			token: 'LINK',
			tokenAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
			spender: 'Uniswap V2 Router',
			spenderAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
			amount: 'Unlimited',
			isUnlimited: true,
			riskLevel: 'medium',
			riskReason: 'Old router version, consider revoking',
			lastActivity: '90 days ago',
			isKnownProtocol: true,
		},
	]
}

export async function fetchAllowances(address: string): Promise<{
	allowances: TokenAllowance[]
	summary: AllowanceSummary
}> {
	if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
		await new Promise(r => setTimeout(r, 800)) // Simulate network delay
		const allowances = getMockAllowances(address)
		return {
			allowances,
			summary: {
				total: allowances.length,
				high: allowances.filter(a => a.riskLevel === 'high').length,
				medium: allowances.filter(a => a.riskLevel === 'medium').length,
				low: allowances.filter(a => a.riskLevel === 'low').length,
				scannedAt: new Date(),
			},
		}
	}

	return {
		allowances: [],
		summary: { total: 0, high: 0, medium: 0, low: 0, scannedAt: new Date() },
	}
}
