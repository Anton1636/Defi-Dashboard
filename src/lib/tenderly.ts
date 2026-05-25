const TENDERLY_BASE = 'https://api.tenderly.co/api/v1'
const ACCESS_KEY = process.env.TENDERLY_ACCESS_KEY ?? ''
const ACCOUNT = process.env.TENDERLY_ACCOUNT_SLUG ?? ''
const PROJECT = process.env.TENDERLY_PROJECT_SLUG ?? ''

export interface SimulationRequest {
	from: string
	to: string
	input: string // encoded calldata
	value?: string // in wei (hex)
	gas?: number
	gasPrice?: string // in wei
	chainId?: number
}

export interface SimulationResult {
	success: boolean
	gasUsed: number
	errorMessage: string | null
	blockNumber: number
	logs: SimulationLog[]
	stateChanges: StateChange[]
}

export interface SimulationLog {
	name: string
	inputs: { name: string; value: string }[]
}

export interface StateChange {
	address: string
	label: string
	from: string
	to: string
}

export async function simulateTransaction(
	req: SimulationRequest,
): Promise<SimulationResult> {
	if (!ACCESS_KEY || !ACCOUNT || !PROJECT) {
		throw new Error('Tenderly credentials not configured')
	}

	const payload = {
		network_id: String(req.chainId ?? 1),
		from: req.from,
		to: req.to,
		input: req.input,
		gas: req.gas ?? 500_000,
		gas_price: req.gasPrice ?? '20000000000',
		value: req.value ?? '0',
		save: false,
		save_if_fails: false,
		simulation_type: 'quick',
	}

	const res = await fetch(
		`${TENDERLY_BASE}/account/${ACCOUNT}/project/${PROJECT}/simulate`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Access-Key': ACCESS_KEY,
			},
			body: JSON.stringify(payload),
		},
	)

	if (!res.ok) {
		const err = await res.text()
		throw new Error(`Tenderly simulation failed: ${err}`)
	}

	const data = await res.json()
	const tx = data.transaction ?? {}
	const sim = data.simulation ?? {}

	// parse logs
	const logs: SimulationLog[] = (tx.transaction_info?.logs ?? []).map(
		(log: {
			name?: string
			inputs?: { soltype?: { name: string }; value: string }[]
		}) => ({
			name: log.name ?? 'Unknown',
			inputs: (log.inputs ?? []).map(
				(inp: { soltype?: { name: string }; value: string }) => ({
					name: inp.soltype?.name ?? '',
					value: String(inp.value),
				}),
			),
		}),
	)

	return {
		success: tx.status === true,
		gasUsed: tx.gas_used ?? sim.gas_used ?? 0,
		errorMessage: tx.error_message ?? null,
		blockNumber: sim.block_number ?? 0,
		logs,
		stateChanges: [],
	}
}
