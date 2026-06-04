'use client'

import { useState, useMemo } from 'react'
import { usePortfolio } from '@/hooks/usePortfolio'
import {
	buildCompareMetrics,
	getMockWalletB,
	type WalletSnapshot,
} from '@/lib/walletCompare'
import { useWallet } from '@/hooks/useWallet'

function fmt(v: number) {
	if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
	if (v >= 1_000) return `$${(v / 1_000).toFixed(2)}K`
	return `$${v.toFixed(2)}`
}

function shortAddr(addr: string) {
	return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

const WINNER_COLORS = {
	a: 'var(--accent-blue)',
	b: 'var(--accent-purple)',
	tie: 'var(--text-tertiary)',
}

const PROTOCOL_ICONS: Record<string, string> = {
	uniswap: '🦄',
	aave: '👻',
	compound: '🏦',
}
const PROTOCOL_COLORS: Record<string, string> = {
	uniswap: '#ff007a',
	aave: '#7b61ff',
	compound: '#00d395',
}

export function WalletCompare() {
	const { address } = useWallet()
	const { data: portfolio } = usePortfolio()
	const [inputB, setInputB] = useState('')
	const [addrB, setAddrB] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const walletA = useMemo<WalletSnapshot | null>(() => {
		if (!portfolio || !address) return null
		return {
			address: address,
			label: 'Your wallet',
			totalValue: portfolio.totalValueUSD,
			change24h: portfolio.change24hPercent,
			positions: portfolio.positions,
			fetchedAt: new Date(),
		}
	}, [portfolio, address])

	const walletB = useMemo<WalletSnapshot | null>(() => {
		if (!addrB || !walletA) return null
		return getMockWalletB(walletA.totalValue)
	}, [addrB, walletA])

	const metrics = useMemo(() => {
		if (!walletA || !walletB) return []
		return buildCompareMetrics(walletA, walletB)
	}, [walletA, walletB])

	const scoreA = metrics.filter(m => m.winner === 'a').length
	const scoreB = metrics.filter(m => m.winner === 'b').length

	const handleCompare = () => {
		if (!inputB.trim()) return
		setError('')
		setLoading(true)
		// Simulate fetch delay
		setTimeout(() => {
			if (!inputB.match(/^0x[a-fA-F0-9]{40}$/) && !inputB.endsWith('.eth')) {
				setError('Invalid address. Use 0x... or ENS name.')
				setLoading(false)
				return
			}
			setAddrB(inputB.trim())
			setLoading(false)
		}, 800)
	}

	return (
		<div className='layout-analytics fade-in'>
			{/* Header */}
			<div style={{ marginBottom: 22 }}>
				<h1
					style={{
						fontSize: 22,
						fontWeight: 900,
						color: 'var(--text-primary)',
						letterSpacing: '-.8px',
						marginBottom: 3,
					}}
				>
					⚖ Wallet Compare
				</h1>
				<p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
					Compare two wallets side-by-side — positions, yield, risk and
					performance
				</p>
			</div>

			{/* Input row */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr auto 1fr',
					gap: 12,
					marginBottom: 20,
					alignItems: 'start',
				}}
			>
				{/* Wallet A */}
				<div
					style={{
						background: 'var(--card-bg)',
						border: `1px solid rgba(0,209,255,.2)`,
						borderRadius: 'var(--card-radius)',
						padding: 16,
					}}
				>
					<p
						style={{
							fontSize: 9,
							fontWeight: 800,
							color: 'var(--accent-blue)',
							letterSpacing: '.14em',
							textTransform: 'uppercase',
							marginBottom: 8,
						}}
					>
						Wallet A — Yours
					</p>
					<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
						<div
							style={{
								width: 36,
								height: 36,
								borderRadius: '50%',
								background:
									'linear-gradient(135deg,var(--accent-blue),var(--accent-purple))',
								flexShrink: 0,
							}}
						/>
						<div>
							<p
								style={{
									fontSize: 13,
									fontWeight: 800,
									color: 'var(--text-primary)',
								}}
							>
								{walletA?.label ?? 'Loading...'}
							</p>
							<p
								style={{
									fontSize: 10,
									color: 'var(--text-tertiary)',
									fontFamily: 'monospace',
								}}
							>
								{address ? shortAddr(address) : '—'}
							</p>
						</div>
					</div>
					{walletA && (
						<div
							style={{
								marginTop: 12,
								paddingTop: 12,
								borderTop: '1px solid var(--border-1)',
							}}
						>
							<p
								style={{
									fontSize: 22,
									fontWeight: 900,
									color: 'var(--accent-blue)',
									letterSpacing: '-1px',
								}}
							>
								{fmt(walletA.totalValue)}
							</p>
							<p
								style={{
									fontSize: 11,
									fontWeight: 700,
									color:
										walletA.change24h >= 0
											? 'var(--accent-green)'
											: 'var(--accent-red)',
									marginTop: 3,
								}}
							>
								{walletA.change24h >= 0 ? '↑' : '↓'}{' '}
								{Math.abs(walletA.change24h).toFixed(2)}% (24h)
							</p>
						</div>
					)}
				</div>

				{/* VS divider */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 8,
						paddingTop: 16,
					}}
				>
					<div
						style={{
							width: 40,
							height: 40,
							borderRadius: '50%',
							background: 'var(--surface-3)',
							border: '1px solid var(--border-2)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 13,
							fontWeight: 900,
							color: 'var(--text-secondary)',
						}}
					>
						VS
					</div>
					{metrics.length > 0 && (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: 2,
							}}
						>
							<span
								style={{
									fontSize: 18,
									fontWeight: 900,
									color: 'var(--accent-blue)',
								}}
							>
								{scoreA}
							</span>
							<span
								style={{
									fontSize: 8,
									color: 'var(--text-tertiary)',
									letterSpacing: '.1em',
								}}
							>
								WINS
							</span>
							<div
								style={{ width: 1, height: 16, background: 'var(--border-1)' }}
							/>
							<span
								style={{
									fontSize: 8,
									color: 'var(--text-tertiary)',
									letterSpacing: '.1em',
								}}
							>
								WINS
							</span>
							<span
								style={{
									fontSize: 18,
									fontWeight: 900,
									color: 'var(--accent-purple)',
								}}
							>
								{scoreB}
							</span>
						</div>
					)}
				</div>

				{/* Wallet B input */}
				<div
					style={{
						background: 'var(--card-bg)',
						border: `1px solid ${addrB ? 'rgba(123,97,255,.2)' : 'var(--card-border)'}`,
						borderRadius: 'var(--card-radius)',
						padding: 16,
					}}
				>
					<p
						style={{
							fontSize: 9,
							fontWeight: 800,
							color: 'var(--accent-purple)',
							letterSpacing: '.14em',
							textTransform: 'uppercase',
							marginBottom: 8,
						}}
					>
						Wallet B — Compare
					</p>
					{!addrB ? (
						<div>
							<div style={{ display: 'flex', gap: 8 }}>
								<input
									value={inputB}
									onChange={e => setInputB(e.target.value)}
									onKeyDown={e => e.key === 'Enter' && handleCompare()}
									placeholder='0x... or ENS name'
									style={{
										flex: 1,
										background: 'var(--surface-2)',
										border: '1px solid var(--border-1)',
										borderRadius: 'var(--card-radius-xs)',
										padding: '8px 12px',
										fontSize: 12,
										color: 'var(--text-primary)',
										outline: 'none',
										fontFamily: 'monospace',
									}}
								/>
								<button
									onClick={handleCompare}
									disabled={loading || !inputB.trim()}
									style={{
										padding: '8px 16px',
										borderRadius: 'var(--card-radius-xs)',
										fontSize: 12,
										fontWeight: 800,
										background: inputB
											? 'linear-gradient(135deg,var(--accent-purple),#5b44d4)'
											: 'var(--surface-3)',
										color: inputB ? '#fff' : 'var(--text-tertiary)',
										border: 'none',
										cursor: inputB ? 'pointer' : 'not-allowed',
										transition: 'all .15s',
										whiteSpace: 'nowrap',
									}}
								>
									{loading ? '...' : 'Compare →'}
								</button>
							</div>
							{error && (
								<p
									style={{
										fontSize: 11,
										color: 'var(--accent-red)',
										marginTop: 6,
									}}
								>
									{error}
								</p>
							)}
							<div
								style={{
									display: 'flex',
									gap: 6,
									marginTop: 8,
									flexWrap: 'wrap',
								}}
							>
								{[
									'vitalik.eth',
									'0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
								].map(s => (
									<button
										key={s}
										onClick={() => setInputB(s)}
										style={{
											padding: '3px 10px',
											borderRadius: 20,
											fontSize: 10,
											fontWeight: 600,
											background: 'var(--surface-2)',
											border: '1px solid var(--border-1)',
											color: 'var(--text-tertiary)',
											cursor: 'pointer',
											fontFamily: 'monospace',
										}}
									>
										{s.endsWith('.eth') ? s : shortAddr(s)}
									</button>
								))}
							</div>
						</div>
					) : (
						<div>
							<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
								<div
									style={{
										width: 36,
										height: 36,
										borderRadius: '50%',
										background:
											'linear-gradient(135deg,var(--accent-purple),#a855f7)',
										flexShrink: 0,
									}}
								/>
								<div>
									<p
										style={{
											fontSize: 13,
											fontWeight: 800,
											color: 'var(--text-primary)',
										}}
									>
										{walletB?.label ?? addrB}
									</p>
									<p
										style={{
											fontSize: 10,
											color: 'var(--text-tertiary)',
											fontFamily: 'monospace',
										}}
									>
										{shortAddr(addrB)}
									</p>
								</div>
								<button
									onClick={() => {
										setAddrB('')
										setInputB('')
									}}
									style={{
										marginLeft: 'auto',
										fontSize: 11,
										color: 'var(--text-tertiary)',
										background: 'transparent',
										border: 'none',
										cursor: 'pointer',
									}}
								>
									✕ Clear
								</button>
							</div>
							{walletB && (
								<div
									style={{
										marginTop: 12,
										paddingTop: 12,
										borderTop: '1px solid var(--border-1)',
									}}
								>
									<p
										style={{
											fontSize: 22,
											fontWeight: 900,
											color: 'var(--accent-purple)',
											letterSpacing: '-1px',
										}}
									>
										{fmt(walletB.totalValue)}
									</p>
									<p
										style={{
											fontSize: 11,
											fontWeight: 700,
											color:
												walletB.change24h >= 0
													? 'var(--accent-green)'
													: 'var(--accent-red)',
											marginTop: 3,
										}}
									>
										{walletB.change24h >= 0 ? '↑' : '↓'}{' '}
										{Math.abs(walletB.change24h).toFixed(2)}% (24h)
									</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Metrics comparison */}
			{metrics.length > 0 && (
				<div
					style={{
						background: 'var(--card-bg)',
						border: '1px solid var(--card-border)',
						borderRadius: 'var(--card-radius)',
						marginBottom: 16,
						overflow: 'hidden',
						boxShadow: 'var(--shadow-card)',
					}}
				>
					{/* Table header */}
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr 1.5fr 1fr',
							gap: 0,
							padding: '10px 16px',
							background: 'var(--surface-2)',
							borderBottom: '1px solid var(--border-1)',
						}}
					>
						{['Wallet A', 'Metric', '', 'Wallet B'].map((h, i) => (
							<p
								key={i}
								style={{
									fontSize: 9,
									fontWeight: 800,
									color: 'var(--text-tertiary)',
									textTransform: 'uppercase',
									letterSpacing: '.12em',
									textAlign: i === 0 ? 'left' : i === 3 ? 'right' : 'center',
								}}
							>
								{h}
							</p>
						))}
					</div>

					{metrics.map((m, i) => (
						<div
							key={m.label}
							style={{
								display: 'grid',
								gridTemplateColumns: '1fr 1fr 1.5fr 1fr',
								gap: 0,
								padding: '12px 16px',
								borderBottom:
									i < metrics.length - 1 ? '1px solid var(--border-1)' : 'none',
								transition: 'background .15s',
							}}
							onMouseEnter={e => {
								e.currentTarget.style.background = 'var(--surface-1)'
							}}
							onMouseLeave={e => {
								e.currentTarget.style.background = 'transparent'
							}}
						>
							{/* A value */}
							<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
								{m.winner === 'a' && <span style={{ fontSize: 10 }}>👑</span>}
								<p
									style={{
										fontSize: 13,
										fontWeight: m.winner === 'a' ? 800 : 500,
										color:
											m.winner === 'a'
												? WINNER_COLORS.a
												: 'var(--text-secondary)',
									}}
								>
									{String(m.a)}
								</p>
							</div>

							{/* Metric label */}
							<p
								style={{
									fontSize: 11,
									color: 'var(--text-tertiary)',
									fontWeight: 600,
									textAlign: 'center',
									alignSelf: 'center',
								}}
							>
								{m.label}
							</p>

							{/* Visual bar */}
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 4,
									padding: '0 8px',
								}}
							>
								{typeof m.a === 'number' && typeof m.b === 'number' ? (
									<>
										<div
											style={{
												flex: 1,
												height: 4,
												background: 'var(--surface-3)',
												borderRadius: 2,
												overflow: 'hidden',
												transform: 'scaleX(-1)',
											}}
										>
											<div
												style={{
													height: '100%',
													width: `${(m.a / (m.a + m.b)) * 100}%`,
													background: 'var(--accent-blue)',
													borderRadius: 2,
												}}
											/>
										</div>
										<div
											style={{
												flex: 1,
												height: 4,
												background: 'var(--surface-3)',
												borderRadius: 2,
												overflow: 'hidden',
											}}
										>
											<div
												style={{
													height: '100%',
													width: `${(m.b / (m.a + m.b)) * 100}%`,
													background: 'var(--accent-purple)',
													borderRadius: 2,
												}}
											/>
										</div>
									</>
								) : (
									<div
										style={{
											flex: 1,
											height: 2,
											background: 'var(--border-1)',
											borderRadius: 1,
										}}
									/>
								)}
							</div>

							{/* B value */}
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 6,
									justifyContent: 'flex-end',
								}}
							>
								<p
									style={{
										fontSize: 13,
										fontWeight: m.winner === 'b' ? 800 : 500,
										color:
											m.winner === 'b'
												? WINNER_COLORS.b
												: 'var(--text-secondary)',
									}}
								>
									{String(m.b)}
								</p>
								{m.winner === 'b' && <span style={{ fontSize: 10 }}>👑</span>}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Protocol breakdown */}
			{walletA && walletA.positions.length > 0 && (
				<div style={{ marginBottom: 16 }}>
					<p
						style={{
							fontSize: 11,
							fontWeight: 800,
							color: 'var(--text-tertiary)',
							letterSpacing: '.14em',
							textTransform: 'uppercase',
							marginBottom: 12,
						}}
					>
						· Protocol Breakdown
					</p>
					<div
						style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
					>
						{/* Wallet A protocols */}
						<div
							style={{
								background: 'var(--card-bg)',
								border: '1px solid rgba(0,209,255,.15)',
								borderRadius: 'var(--card-radius)',
								padding: 16,
							}}
						>
							<p
								style={{
									fontSize: 10,
									fontWeight: 800,
									color: 'var(--accent-blue)',
									marginBottom: 12,
								}}
							>
								Wallet A — {shortAddr(walletA.address)}
							</p>
							{walletA.positions.length === 0 ? (
								<p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
									No positions
								</p>
							) : (
								walletA.positions.map(pos => (
									<div
										key={pos.id}
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: 10,
											marginBottom: 10,
										}}
									>
										<div
											style={{
												width: 28,
												height: 28,
												borderRadius: 8,
												background: `${PROTOCOL_COLORS[pos.protocol]}18`,
												border: `1px solid ${PROTOCOL_COLORS[pos.protocol]}30`,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												fontSize: 14,
											}}
										>
											{PROTOCOL_ICONS[pos.protocol]}
										</div>
										<div style={{ flex: 1 }}>
											<p
												style={{
													fontSize: 12,
													fontWeight: 700,
													color: 'var(--text-primary)',
												}}
											>
												{pos.protocol.charAt(0).toUpperCase() +
													pos.protocol.slice(1)}{' '}
												V3
											</p>
											<p
												style={{
													fontSize: 11,
													fontWeight: 700,
													color: 'var(--accent-blue)',
												}}
											>
												{fmt(pos.valueUSD)}
											</p>
										</div>
									</div>
								))
							)}
						</div>

						{/* Wallet B protocols */}
						<div
							style={{
								background: 'var(--card-bg)',
								border: '1px solid rgba(123,97,255,.15)',
								borderRadius: 'var(--card-radius)',
								padding: 16,
							}}
						>
							<p
								style={{
									fontSize: 10,
									fontWeight: 800,
									color: 'var(--accent-purple)',
									marginBottom: 12,
								}}
							>
								{walletB
									? `Wallet B — ${walletB.label ?? shortAddr(addrB)}`
									: 'Wallet B — Not loaded'}
							</p>
							{!walletB ? (
								<p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
									Enter an address above to compare
								</p>
							) : walletB.positions.length === 0 ? (
								<div
									style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
								>
									{['Uniswap V3', 'Aave V3', 'Compound V3'].map((name, i) => (
										<div
											key={name}
											style={{ display: 'flex', alignItems: 'center', gap: 10 }}
										>
											<div
												style={{
													width: 28,
													height: 28,
													borderRadius: 8,
													background: 'var(--surface-2)',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													fontSize: 14,
												}}
											>
												{['🦄', '👻', '🏦'][i]}
											</div>
											<div style={{ flex: 1 }}>
												<p
													style={{
														fontSize: 12,
														fontWeight: 700,
														color: 'var(--text-primary)',
													}}
												>
													{name}
												</p>
												<p
													style={{
														fontSize: 11,
														fontWeight: 700,
														color: 'var(--accent-purple)',
													}}
												>
													{fmt(walletB.totalValue * [0.5, 0.33, 0.17][i])}
												</p>
											</div>
										</div>
									))}
								</div>
							) : (
								walletB.positions.map(pos => (
									<div
										key={pos.id}
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: 10,
											marginBottom: 10,
										}}
									>
										<div
											style={{
												width: 28,
												height: 28,
												borderRadius: 8,
												background: `${PROTOCOL_COLORS[pos.protocol]}18`,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												fontSize: 14,
											}}
										>
											{PROTOCOL_ICONS[pos.protocol]}
										</div>
										<div style={{ flex: 1 }}>
											<p
												style={{
													fontSize: 12,
													fontWeight: 700,
													color: 'var(--text-primary)',
												}}
											>
												{pos.protocol.charAt(0).toUpperCase() +
													pos.protocol.slice(1)}{' '}
												V3
											</p>
											<p
												style={{
													fontSize: 11,
													fontWeight: 700,
													color: 'var(--accent-purple)',
												}}
											>
												{fmt(pos.valueUSD)}
											</p>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			)}

			{/* AI Summary */}
			{metrics.length > 0 && (
				<div
					style={{
						background:
							'linear-gradient(135deg,rgba(0,209,255,.05),rgba(123,97,255,.05))',
						border: '1px solid rgba(0,209,255,.12)',
						borderRadius: 'var(--card-radius)',
						padding: 18,
						position: 'relative',
						overflow: 'hidden',
					}}
				>
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							height: 2,
							background:
								'linear-gradient(90deg,var(--accent-blue),var(--accent-purple),transparent)',
						}}
					/>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							marginBottom: 10,
						}}
					>
						<div
							style={{
								width: 24,
								height: 24,
								borderRadius: 6,
								background:
									'linear-gradient(135deg,var(--accent-blue),var(--accent-purple))',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 12,
								color: '#fff',
								fontWeight: 900,
							}}
						>
							G
						</div>
						<p
							style={{
								fontSize: 12,
								fontWeight: 800,
								color: 'var(--accent-blue)',
							}}
						>
							AI Comparison Summary
						</p>
					</div>
					<p
						style={{
							fontSize: 12,
							color: 'var(--text-secondary)',
							lineHeight: 1.7,
						}}
					>
						{scoreA > scoreB
							? `Your wallet leads with ${scoreA} wins vs ${scoreB}. You have better overall DeFi positioning. Main advantage: higher ${metrics.find(m => m.winner === 'a')?.label?.toLowerCase() ?? 'performance'}.`
							: scoreB > scoreA
								? `Wallet B leads with ${scoreB} wins vs ${scoreA}. Consider reviewing your strategy — they have better ${metrics.find(m => m.winner === 'b')?.label?.toLowerCase() ?? 'metrics'}.`
								: `Both wallets are evenly matched with ${scoreA} wins each. Different risk/reward profiles.`}
						{(() => {
							const hfMetric = metrics.find(m => m.label === 'Health Factor')
							const hfVal = hfMetric?.a
							if (!hfVal || hfVal === '—') return null
							const hfNum = parseFloat(String(hfVal))
							if (isNaN(hfNum)) return null
							return ` Your Aave health factor of ${hfNum.toFixed(2)} is ${hfNum > 2 ? 'safe' : 'worth monitoring'}.`
						})()}
					</p>
				</div>
			)}
		</div>
	)
}
