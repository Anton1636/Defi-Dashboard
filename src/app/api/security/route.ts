import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '../../../../auth'
import {
	checkTokenSecurity,
	checkAddressSecurity,
	checkApprovalSecurity,
} from '@/lib/goplus'

export async function POST(request: NextRequest) {
	const session = await auth()
	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = await request.json()
	const { type, chainId = 1, address } = body

	if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
		return NextResponse.json(getMockSecurityData(type, address))
	}

	try {
		switch (type) {
			case 'token': {
				const result = await checkTokenSecurity(chainId, address)
				return NextResponse.json(result)
			}
			case 'address': {
				const result = await checkAddressSecurity(address)
				return NextResponse.json(result)
			}
			case 'approval': {
				const result = await checkApprovalSecurity(chainId, address)
				return NextResponse.json(result)
			}
			default:
				return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
		}
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Security check failed'
		console.error('[API/security]', message)
		return NextResponse.json({ error: message }, { status: 500 })
	}
}

function getMockSecurityData(type: string, address: string) {
	if (type === 'token') {
		if (address === '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2') {
			return {
				isHoneypot: false,
				isMintable: false,
				isProxy: false,
				isBlacklisted: false,
				buyTax: 0,
				sellTax: 0,
				holderCount: 450000,
				isOpenSource: true,
				riskFlags: [],
			}
		}
		return {
			isHoneypot: false,
			isMintable: true,
			isProxy: false,
			isBlacklisted: false,
			buyTax: 0,
			sellTax: 0,
			holderCount: 2000000,
			isOpenSource: true,
			riskFlags: ['Mintable supply'],
		}
	}

	if (type === 'address') {
		const isUnknown = address.includes('cafe1234')
		return {
			isPhishing: isUnknown,
			isCybercrime: false,
			isMoneyLaundering: false,
			isSanctioned: false,
			isDarkweb: false,
			riskFlags: isUnknown ? ['Phishing activity detected'] : [],
		}
	}

	if (type === 'approval') {
		const isUnknown = address.includes('cafe1234')
		return {
			isApprovalAbuse: isUnknown,
			riskLevel: isUnknown ? 'high' : 'low',
			riskFlags: isUnknown
				? ['Contract not open source', 'Malicious behavior detected']
				: [],
		}
	}

	return {}
}
