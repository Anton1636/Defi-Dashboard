import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '../../../../auth'
import { simulateTransaction } from '@/lib/tenderly'

const CONTRACTS = {
	uniswapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
	aavePool: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
	compoundComet: '0xc3d688B66703497DAA19211EEdff47f25384cdc3',
	usdcToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
	wethToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
}

function getMockResult(
	type: string,
	amount: number,
	gasGwei: number,
	ethPrice: number,
) {
	const gasMap: Record<string, number> = {
		'eth-transfer': 21_000,
		'erc20-transfer': 65_000,
		'uniswap-swap': 152_000,
		'aave-supply': 205_000,
		'aave-repay': 195_000,
		'compound-supply': 148_000,
	}

	const gasUsed = gasMap[type] ?? 100_000
	const gasCostUSD = ((gasUsed * gasGwei) / 1e9) * ethPrice

	const outputMap: Record<string, string> = {
		'uniswap-swap': `${(amount * 3245.5).toFixed(2)} USDC`,
		'aave-supply': `${amount} aETH minted`,
		'aave-repay': `Debt reduced by ${amount} ETH`,
		'compound-supply': `${(amount * 3245.5).toFixed(2)} cUSDC minted`,
		'eth-transfer': `${amount} ETH transferred`,
		'erc20-transfer': `${amount} tokens transferred`,
	}

	return {
		success: true,
		gasUsed,
		gasCostUSD,
		errorMessage: null,
		blockNumber: 19_500_000 + Math.floor(Math.random() * 1000),
		expectedOutput: outputMap[type] ?? 'Transaction executed',
		priceImpact:
			type === 'uniswap-swap' ? (amount * 0.08).toFixed(2) + '%' : null,
		logs: [
			{
				name: 'Transfer',
				inputs: [
					{ name: 'from', value: '0x8d63...2911' },
					{ name: 'value', value: `${amount} ETH` },
				],
			},
		],
	}
}

export async function POST(request: NextRequest) {
	const session = await auth()
	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = await request.json()
	const { type, amount = 1, gasGwei = 20, ethPrice = 3245 } = body

	if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
		await new Promise(r => setTimeout(r, 1200))
		return NextResponse.json(getMockResult(type, amount, gasGwei, ethPrice))
	}

	try {
		const from =
			body.walletAddress ?? '0x0000000000000000000000000000000000000001'

		let simReq = {
			from,
			to: CONTRACTS.uniswapRouter,
			input: '0x',
			value: '0',
			chainId: 1,
		}

		switch (type) {
			case 'eth-transfer':
				simReq = {
					from,
					to: body.recipient ?? from,
					input: '0x',
					value: `0x${Math.floor(amount * 1e18).toString(16)}`,
					chainId: 1,
				}
				break
			case 'uniswap-swap':
				simReq.to = CONTRACTS.uniswapRouter
				simReq.value = `0x${Math.floor(amount * 1e18).toString(16)}`
				break
			case 'aave-supply':
				simReq.to = CONTRACTS.aavePool
				break
		}

		const result = await simulateTransaction(simReq)
		const gasCostUSD = ((result.gasUsed * gasGwei) / 1e9) * ethPrice

		return NextResponse.json({ ...result, gasCostUSD })
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Simulation failed'
		console.error('[API/simulate]', message)
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
