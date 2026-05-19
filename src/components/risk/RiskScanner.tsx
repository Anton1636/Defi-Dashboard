'use client'

import { useState } from 'react'
import { useAllowances } from '@/hooks/useAllowances'
import { useSecurityScan } from '@/hooks/useSecurityScan'
import { useWallet } from '@/hooks/useWallet'
import { AllowanceRow } from './AllowanceRow'
import { PhishingAlert } from './PhishingAlert'
import { SecurityBadge } from './SecurityBadge'
import type { RiskLevel } from '@/lib/allowances'

type Filter = 'all' | RiskLevel

export function RiskScanner() {
	const { address } = useWallet()
	const { allowances, summary, isLoading, isScanned, error, scan } =
		useAllowances()
	const { results, isScanning, walletRisk, isDone, scanSecurity } =
		useSecurityScan()
	const [filter, setFilter] = useState<Filter>('all')

	const filtered =
		filter === 'all'
			? allowances
			: allowances.filter(a => a.riskLevel === filter)

	const FILTERS: { key: Filter; label: string; count?: number }[] = [
		{ key: 'all', label: 'All', count: summary?.total },
		{ key: 'high', label: '🔴 High', count: summary?.high },
		{ key: 'medium', label: '🟡 Medium', count: summary?.medium },
		{ key: 'low', label: '🟢 Low', count: summary?.low },
	]

	const handleScan = () => {
		if (!address) return
		scan(address)
	}

	const handleDeepScan = () => {
		if (!address || allowances.length === 0) return
		scanSecurity(address, allowances)
	}

	return (
		<div className='card' style={{ padding: 20, marginTop: 24 }}>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 16,
				}}
			>
				<div>
					<p
						style={{
							fontSize: 14,
							fontWeight: 600,
							color: 'var(--text-primary)',
							marginBottom: 4,
						}}
					>
						🛡️ Token Approval Scanner
					</p>
					<p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
						Check which contracts have permission to spend your tokens
					</p>
				</div>

				<div style={{ display: 'flex', gap: 8 }}>
					{isScanned && (
						<button
							onClick={handleDeepScan}
							disabled={isScanning}
							style={{
								background: isScanning
									? 'var(--bg-elevated)'
									: 'rgba(99,102,241,0.1)',
								color: isScanning
									? 'var(--text-tertiary)'
									: 'var(--accent-blue)',
								border: '1px solid rgba(99,102,241,0.3)',
								borderRadius: 10,
								padding: '7px 14px',
								fontSize: 12,
								fontWeight: 600,
								cursor: isScanning ? 'not-allowed' : 'pointer',
								transition: 'all 0.15s',
								whiteSpace: 'nowrap',
							}}
						>
							{isScanning ? '🔍 GoPlus scanning...' : '🔍 GoPlus Deep Scan'}
						</button>
					)}

					{!isScanned ? (
						<button
							onClick={handleScan}
							disabled={isLoading || !address}
							style={{
								background: isLoading
									? 'var(--bg-elevated)'
									: 'var(--gradient-blue)',
								color: isLoading ? 'var(--text-tertiary)' : '#fff',
								border: 'none',
								borderRadius: 10,
								padding: '9px 18px',
								fontSize: 13,
								fontWeight: 600,
								cursor: isLoading ? 'not-allowed' : 'pointer',
								transition: 'all 0.2s',
								boxShadow: isLoading
									? 'none'
									: '0 0 20px var(--accent-blue-glow)',
							}}
						>
							{isLoading ? '🔍 Scanning...' : '🔍 Scan Wallet'}
						</button>
					) : (
						<button
							onClick={handleScan}
							disabled={isLoading}
							style={{
								background: 'transparent',
								color: 'var(--text-tertiary)',
								border: '1px solid var(--border-primary)',
								borderRadius: 10,
								padding: '7px 14px',
								fontSize: 12,
								cursor: 'pointer',
							}}
						>
							{isLoading ? '...' : '↻ Rescan'}
						</button>
					)}
				</div>
			</div>

			{/* Phishing alert */}
			{walletRisk.length > 0 && address && (
				<PhishingAlert flags={walletRisk} address={address} />
			)}

			{/* GoPlus scan complete banner */}
			{isDone && walletRisk.length === 0 && (
				<div
					style={{
						background: 'var(--accent-green-glow)',
						border: '1px solid rgba(16,185,129,0.2)',
						borderRadius: 10,
						padding: '10px 14px',
						marginBottom: 14,
						fontSize: 12,
						color: 'var(--accent-green)',
						display: 'flex',
						alignItems: 'center',
						gap: 8,
					}}
				>
					✓ GoPlus Security scan complete — wallet address is clean
				</div>
			)}

			{/* Loading */}
			{isLoading && (
				<div style={{ padding: '32px 0', textAlign: 'center' }}>
					<div
						style={{
							fontSize: 24,
							marginBottom: 8,
							animation: 'pulse 1.5s infinite',
						}}
					>
						🔍
					</div>
					<p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
						Scanning wallet for token approvals...
					</p>
				</div>
			)}

			{error && (
				<div
					style={{
						background: 'var(--accent-red-glow)',
						border: '1px solid rgba(239,68,68,0.2)',
						borderRadius: 8,
						padding: '10px 14px',
						fontSize: 13,
						color: 'var(--accent-red)',
					}}
				>
					{error}
				</div>
			)}

			{/* Not scanned */}
			{!isScanned && !isLoading && (
				<div
					style={{
						padding: '32px 0',
						textAlign: 'center',
						color: 'var(--text-tertiary)',
					}}
				>
					<p style={{ fontSize: 32, marginBottom: 12 }}>🛡️</p>
					<p style={{ fontSize: 13, marginBottom: 4 }}>
						Scan your wallet for risky token approvals
					</p>
					<p style={{ fontSize: 12 }}>
						Find contracts that can spend your tokens and revoke unnecessary
						permissions
					</p>
				</div>
			)}

			{/* Results */}
			{isScanned && !isLoading && summary && (
				<>
					{/* Summary */}
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(4, 1fr)',
							gap: 8,
							marginBottom: 16,
							padding: '12px 16px',
							background: 'var(--bg-elevated)',
							borderRadius: 10,
						}}
					>
						{[
							{
								label: 'Total found',
								value: summary.total,
								color: 'var(--text-primary)',
							},
							{
								label: '🔴 High risk',
								value: summary.high,
								color: 'var(--accent-red)',
							},
							{
								label: '🟡 Medium',
								value: summary.medium,
								color: 'var(--accent-amber)',
							},
							{
								label: '🟢 Low risk',
								value: summary.low,
								color: 'var(--accent-green)',
							},
						].map(s => (
							<div key={s.label} style={{ textAlign: 'center' }}>
								<p style={{ fontSize: 20, fontWeight: 700, color: s.color }}>
									{s.value}
								</p>
								<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
									{s.label}
								</p>
							</div>
						))}
					</div>

					{/* Warning */}
					{summary.high > 0 && (
						<div
							style={{
								background: 'var(--accent-red-glow)',
								border: '1px solid rgba(239,68,68,0.25)',
								borderRadius: 10,
								padding: '10px 14px',
								marginBottom: 14,
								fontSize: 12,
								color: 'var(--accent-red)',
								display: 'flex',
								alignItems: 'center',
								gap: 8,
							}}
						>
							<span style={{ fontSize: 16 }}>⚠️</span>
							<span>
								{summary.high} high-risk approval{summary.high > 1 ? 's' : ''}{' '}
								found. Consider revoking at{' '}
								<a
									href='https://revoke.cash'
									target='_blank'
									rel='noopener noreferrer'
									style={{ color: 'var(--accent-red)', fontWeight: 600 }}
								>
									revoke.cash
								</a>
							</span>
						</div>
					)}

					{/* GoPlus scanning progress */}
					{isScanning && (
						<div
							style={{
								background: 'var(--accent-blue-glow)',
								border: '1px solid var(--border-accent)',
								borderRadius: 10,
								padding: '10px 14px',
								marginBottom: 14,
								fontSize: 12,
								color: 'var(--accent-blue)',
								display: 'flex',
								alignItems: 'center',
								gap: 8,
							}}
						>
							<span
								style={{
									animation: 'pulse 1.5s infinite',
									display: 'inline-block',
								}}
							>
								🔍
							</span>
							Running GoPlus deep security scan on {allowances.length}{' '}
							approvals...
						</div>
					)}

					{/* Filter tabs */}
					<div
						style={{
							display: 'flex',
							gap: 6,
							marginBottom: 12,
							flexWrap: 'wrap',
						}}
					>
						{FILTERS.map(f => {
							const isActive = filter === f.key
							return (
								<button
									key={f.key}
									onClick={() => setFilter(f.key)}
									style={{
										padding: '5px 12px',
										borderRadius: 8,
										fontSize: 12,
										fontWeight: isActive ? 600 : 400,
										color: isActive
											? 'var(--text-primary)'
											: 'var(--text-tertiary)',
										background: isActive ? 'var(--bg-elevated)' : 'transparent',
										border: `1px solid ${isActive ? 'var(--border-secondary)' : 'transparent'}`,
										cursor: 'pointer',
										transition: 'all 0.15s',
									}}
								>
									{f.label} {f.count !== undefined && `(${f.count})`}
								</button>
							)
						})}
					</div>

					{/* Allowance list */}
					<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
						{filtered.length === 0 ? (
							<p
								style={{
									textAlign: 'center',
									fontSize: 13,
									color: 'var(--text-tertiary)',
									padding: '24px 0',
								}}
							>
								No {filter} risk approvals found
							</p>
						) : (
							filtered.map(a => (
								<div key={a.id}>
									<AllowanceRow allowance={a} />
									{results[a.id] && (
										<div style={{ padding: '6px 12px 10px', marginTop: -4 }}>
											<SecurityBadge
												flags={[
													...results[a.id].tokenRisk,
													...results[a.id].approvalRisk,
												]}
												compact
											/>
										</div>
									)}
								</div>
							))
						)}
					</div>

					<p
						style={{
							fontSize: 11,
							color: 'var(--text-tertiary)',
							marginTop: 12,
							textAlign: 'right',
						}}
					>
						Scanned at {summary.scannedAt.toLocaleTimeString()}
						{isDone && ' · GoPlus verified'}
					</p>
				</>
			)}
		</div>
	)
}
