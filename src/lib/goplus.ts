const GOPLUS_BASE = 'https://api.gopluslabs.io/api/v1'
const API_KEY = process.env.GOPLUS_API_KEY ?? ''

export interface TokenSecurityResult {
	isHoneypot: boolean
	isMintable: boolean
	isProxy: boolean
	isBlacklisted: boolean
	buyTax: number
	sellTax: number
	holderCount: number
	isOpenSource: boolean
	riskFlags: string[]
}

export interface AddressSecurityResult {
	isPhishing: boolean
	isCybercrime: boolean
	isMoneyLaundering: boolean
	isSanctioned: boolean
	isDarkweb: boolean
	riskFlags: string[]
}

export interface ApprovalSecurityResult {
	isApprovalAbuse: boolean
	riskLevel: 'low' | 'medium' | 'high'
	riskFlags: string[]
}

export async function checkTokenSecurity(
	chainId: number,
	tokenAddress: string,
): Promise<TokenSecurityResult> {
	const res = await fetch(
		`${GOPLUS_BASE}/token_security/${chainId}?contract_addresses=${tokenAddress}`,
		{
			headers: { Authorization: API_KEY },
			next: { revalidate: 300 },
		},
	)

	if (!res.ok) throw new Error(`GoPlus token security failed: ${res.status}`)

	const json = await res.json()
	const data = json.result?.[tokenAddress.toLowerCase()] ?? {}

	const riskFlags: string[] = []
	if (data.is_honeypot === '1') riskFlags.push('Honeypot — cannot sell')
	if (data.is_mintable === '1') riskFlags.push('Mintable supply')
	if (data.is_blacklisted === '1') riskFlags.push('Blacklisted')
	if (parseFloat(data.buy_tax ?? '0') > 10)
		riskFlags.push(`High buy tax: ${data.buy_tax}%`)
	if (parseFloat(data.sell_tax ?? '0') > 10)
		riskFlags.push(`High sell tax: ${data.sell_tax}%`)

	return {
		isHoneypot: data.is_honeypot === '1',
		isMintable: data.is_mintable === '1',
		isProxy: data.is_proxy === '1',
		isBlacklisted: data.is_blacklisted === '1',
		buyTax: parseFloat(data.buy_tax ?? '0'),
		sellTax: parseFloat(data.sell_tax ?? '0'),
		holderCount: parseInt(data.holder_count ?? '0'),
		isOpenSource: data.is_open_source === '1',
		riskFlags,
	}
}

export async function checkAddressSecurity(
	address: string,
): Promise<AddressSecurityResult> {
	const res = await fetch(`${GOPLUS_BASE}/address_security/${address}`, {
		headers: { Authorization: API_KEY },
		next: { revalidate: 300 },
	})

	if (!res.ok) throw new Error(`GoPlus address security failed: ${res.status}`)

	const json = await res.json()
	const data = json.result ?? {}

	const riskFlags: string[] = []
	if (data.phishing_activities === '1')
		riskFlags.push('Phishing activity detected')
	if (data.cybercrime === '1') riskFlags.push('Cybercrime association')
	if (data.money_laundering === '1') riskFlags.push('Money laundering risk')
	if (data.sanctioned === '1') riskFlags.push('Sanctioned address')
	if (data.darkweb_transactions === '1') riskFlags.push('Dark web transactions')

	return {
		isPhishing: data.phishing_activities === '1',
		isCybercrime: data.cybercrime === '1',
		isMoneyLaundering: data.money_laundering === '1',
		isSanctioned: data.sanctioned === '1',
		isDarkweb: data.darkweb_transactions === '1',
		riskFlags,
	}
}

export async function checkApprovalSecurity(
	chainId: number,
	spenderAddress: string,
): Promise<ApprovalSecurityResult> {
	const res = await fetch(
		`${GOPLUS_BASE}/approval_security/${chainId}?contract_addresses=${spenderAddress}`,
		{
			headers: { Authorization: API_KEY },
			next: { revalidate: 300 },
		},
	)

	if (!res.ok) throw new Error(`GoPlus approval security failed: ${res.status}`)

	const json = await res.json()
	const data = json.result?.[spenderAddress.toLowerCase()] ?? {}

	const riskFlags: string[] = []
	let riskLevel: 'low' | 'medium' | 'high' = 'low'

	if (data.is_open_source === '0') {
		riskFlags.push('Contract not open source')
		riskLevel = 'medium'
	}
	if (data.malicious_behavior?.length > 0) {
		riskFlags.push('Malicious behavior detected')
		riskLevel = 'high'
	}
	if (data.doubt_list === '1') {
		riskFlags.push('Listed on doubt list')
		riskLevel = 'high'
	}

	return {
		isApprovalAbuse: riskLevel === 'high',
		riskLevel,
		riskFlags,
	}
}
