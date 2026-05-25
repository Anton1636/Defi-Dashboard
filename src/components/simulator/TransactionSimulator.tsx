'use client'

import { useState } from 'react'
import { useSimulator, type SimType } from '@/hooks/useSimulator'
import { useWallet } from '@/hooks/useWallet'

const SIM_TYPES: {
	value: SimType
	label: string
	icon: string
	desc: string
}[] = [
	{
		value: 'eth-transfer',
		label: 'ETH Transfer',
		icon: '⟠',
		desc: 'Send ETH to an address',
	},
	{
		value: 'uniswap-swap',
		label: 'Uniswap Swap',
		icon: '🦄',
		desc: 'Swap ETH → USDC',
	},
	{
		value: 'aave-supply',
		label: 'Aave Supply',
		icon: '👻',
		desc: 'Supply ETH as collateral',
	},
	{
		value: 'aave-repay',
		label: 'Aave Repay',
		icon: '💳',
		desc: 'Repay your Aave debt',
	},
	{
		value: 'compound-supply',
		label: 'Compound Supply',
		icon: '🏦',
		desc: 'Supply to Compound market',
	},
	{
		value: 'erc20-transfer',
		label: 'Token Transfer',
		icon: '🪙',
		desc: 'Transfer ERC-20 token',
	},
]

export function TransactionSimulator() {
	const { address } = useWallet()
	const { result, isSimulating, error, simulate, reset } = useSimulator()
	const [selectedType, setSelectedType] = useState<SimType>('uniswap-swap')
	const [amount, setAmount] = useState('1.0')

	const handleSimulate = () => {
		if (!address) return
		simulate(selectedType, parseFloat(amount) || 1, address)
	}

	const selectedInfo = SIM_TYPES.find(t => t.value === selectedType)!

	return (
		<div className='card' style={{ padding: 20, marginTop: 24 }}>
			{/* Header */}
			<div style={{ marginBottom: 20 }}>
				<p
					style={{
						fontSize: 14,
						fontWeight: 600,
						color: 'var(--text-primary)',
						marginBottom: 4,
					}}
				>
					🔬 Transaction Simulator
				</p>
				<p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
					Preview transactions before executing — see gas cost and expected
					outcome
				</p>
			</div>

			{/* Transaction type selector */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: 8,
					marginBottom: 16,
				}}
			>
				{SIM_TYPES.map(t => {
					const isActive = selectedType === t.value
					return (
						<button
							key={t.value}
							onClick={() => {
								setSelectedType(t.value)
								reset()
							}}
							style={{
								padding: '10px 12px',
								borderRadius: 10,
								border: `1px solid ${isActive ? 'var(--border-accent)' : 'var(--border-primary)'}`,
								background: isActive
									? 'var(--accent-blue-glow)'
									: 'var(--bg-elevated)',
								cursor: 'pointer',
								textAlign: 'left',
								transition: 'all 0.15s',
							}}
						>
							<div style={{ fontSize: 18, marginBottom: 2 }}>{t.icon}</div>
							<p
								style={{
									fontSize: 12,
									fontWeight: 600,
									color: isActive
										? 'var(--accent-blue)'
										: 'var(--text-primary)',
								}}
							>
								{t.label}
							</p>
							<p style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
								{t.desc}
							</p>
						</button>
					)
				})}
			</div>

			{/* Amount input */}
			<div style={{ marginBottom: 16 }}>
				<label
					style={{
						fontSize: 12,
						color: 'var(--text-tertiary)',
						display: 'block',
						marginBottom: 6,
					}}
				>
					Amount (ETH)
				</label>
				<div style={{ display: 'flex', gap: 8 }}>
					<input
						type='number'
						value={amount}
						onChange={e => setAmount(e.target.value)}
						min='0.001'
						step='0.1'
						style={{
							flex: 1,
							background: 'var(--bg-elevated)',
							border: '1px solid var(--border-primary)',
							borderRadius: 10,
							padding: '10px 14px',
							fontSize: 14,
							color: 'var(--text-primary)',
							fontVariantNumeric: 'tabular-nums',
							outline: 'none',
						}}
					/>
					{['0.1', '0.5', '1.0'].map(v => (
						<button
							key={v}
							onClick={() => setAmount(v)}
							style={{
								padding: '8px 12px',
								borderRadius: 8,
								border: '1px solid var(--border-primary)',
								background:
									amount === v
										? 'var(--accent-blue-glow)'
										: 'var(--bg-elevated)',
								color:
									amount === v ? 'var(--accent-blue)' : 'var(--text-tertiary)',
								fontSize: 12,
								cursor: 'pointer',
								transition: 'all 0.15s',
							}}
						>
							{v}
						</button>
					))}
				</div>
			</div>

			{/* Wallet info */}
			{address && (
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						fontSize: 12,
						color: 'var(--text-tertiary)',
						marginBottom: 16,
						padding: '8px 12px',
						background: 'var(--bg-elevated)',
						borderRadius: 8,
					}}
				>
					<span>
						From:{' '}
						<span
							style={{
								fontFamily: 'monospace',
								color: 'var(--text-secondary)',
							}}
						>
							{address.slice(0, 10)}...{address.slice(-6)}
						</span>
					</span>
					<span>Network: Ethereum Mainnet</span>
				</div>
			)}

			{/* Simulate button */}
			<button
				onClick={handleSimulate}
				disabled={isSimulating || !address}
				style={{
					width: '100%',
					padding: '12px',
					borderRadius: 12,
					border: 'none',
					background: isSimulating
						? 'var(--bg-elevated)'
						: 'var(--gradient-blue)',
					color: isSimulating ? 'var(--text-tertiary)' : '#fff',
					fontSize: 14,
					fontWeight: 600,
					cursor: isSimulating || !address ? 'not-allowed' : 'pointer',
					transition: 'all 0.2s',
					boxShadow: isSimulating ? 'none' : '0 0 20px var(--accent-blue-glow)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 8,
				}}
			>
				{isSimulating ? (
					<>
						<span
							style={{
								animation: 'pulse 1.5s infinite',
								display: 'inline-block',
							}}
						>
							🔬
						</span>
						Simulating on Tenderly...
					</>
				) : (
					<>🔬 Simulate {selectedInfo.label}</>
				)}
			</button>

			{/* Error */}
			{error && (
				<div
					style={{
						marginTop: 14,
						padding: '12px 14px',
						background: 'var(--accent-red-glow)',
						border: '1px solid rgba(239,68,68,0.2)',
						borderRadius: 10,
						fontSize: 13,
						color: 'var(--accent-red)',
					}}
				>
					❌ {error}
				</div>
			)}

			{/* Result */}
			{result && (
				<div
					style={{
						marginTop: 14,
						padding: 16,
						background: result.success
							? 'rgba(16,185,129,0.06)'
							: 'rgba(239,68,68,0.06)',
						border: `1px solid ${result.success ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
						borderRadius: 12,
						animation: 'fadeIn 0.3s ease-out',
					}}
				>
					{/* Status */}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							marginBottom: 14,
						}}
					>
						<span style={{ fontSize: 20 }}>{result.success ? '✅' : '❌'}</span>
						<div>
							<p
								style={{
									fontSize: 14,
									fontWeight: 700,
									color: result.success
										? 'var(--accent-green)'
										: 'var(--accent-red)',
								}}
							>
								{result.success
									? 'Transaction will succeed'
									: 'Transaction will fail'}
							</p>
							{result.errorMessage && (
								<p style={{ fontSize: 12, color: 'var(--accent-red)' }}>
									{result.errorMessage}
								</p>
							)}
						</div>
					</div>

					{/* Stats grid */}
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(2, 1fr)',
							gap: 10,
							marginBottom: 14,
						}}
					>
						{[
							{
								label: 'Gas used',
								value: result.gasUsed.toLocaleString() + ' units',
							},
							{ label: 'Gas cost', value: `~$${result.gasCostUSD.toFixed(2)}` },
							{ label: 'Expected output', value: result.expectedOutput },
							...(result.priceImpact
								? [{ label: 'Price impact', value: result.priceImpact }]
								: []),
						].map(stat => (
							<div
								key={stat.label}
								style={{
									background: 'var(--bg-elevated)',
									borderRadius: 8,
									padding: '10px 12px',
								}}
							>
								<p
									style={{
										fontSize: 11,
										color: 'var(--text-tertiary)',
										marginBottom: 3,
									}}
								>
									{stat.label}
								</p>
								<p
									style={{
										fontSize: 13,
										fontWeight: 600,
										color: 'var(--text-primary)',
									}}
								>
									{stat.value}
								</p>
							</div>
						))}
					</div>

					{/* Logs */}
					{result.logs.length > 0 && (
						<div>
							<p
								style={{
									fontSize: 11,
									fontWeight: 500,
									color: 'var(--text-tertiary)',
									textTransform: 'uppercase',
									letterSpacing: '0.06em',
									marginBottom: 8,
								}}
							>
								Events
							</p>
							{result.logs.map((log, i) => (
								<div
									key={i}
									style={{
										padding: '8px 10px',
										background: 'var(--bg-elevated)',
										borderRadius: 8,
										marginBottom: 6,
									}}
								>
									<p
										style={{
											fontSize: 12,
											fontWeight: 600,
											color: 'var(--accent-blue)',
											marginBottom: 4,
										}}
									>
										{log.name}
									</p>
									{log.inputs.map((inp, j) => (
										<p
											key={j}
											style={{ fontSize: 11, color: 'var(--text-tertiary)' }}
										>
											<span style={{ color: 'var(--text-secondary)' }}>
												{inp.name}:
											</span>{' '}
											{inp.value}
										</p>
									))}
								</div>
							))}
						</div>
					)}

					<p
						style={{
							fontSize: 10,
							color: 'var(--text-tertiary)',
							marginTop: 10,
							textAlign: 'right',
						}}
					>
						Simulated at block #{result.blockNumber.toLocaleString()} · Powered
						by Tenderly
					</p>
				</div>
			)}
		</div>
	)
}
