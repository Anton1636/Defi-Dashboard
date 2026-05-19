'use client'

interface PhishingAlertProps {
	flags: string[]
	address: string
}

export function PhishingAlert({ flags, address }: PhishingAlertProps) {
	if (flags.length === 0) return null

	return (
		<div
			style={{
				background: 'rgba(239,68,68,0.08)',
				border: '1px solid rgba(239,68,68,0.3)',
				borderRadius: 12,
				padding: '14px 18px',
				marginBottom: 16,
				display: 'flex',
				alignItems: 'flex-start',
				gap: 12,
				animation: 'fadeIn 0.3s ease-out',
			}}
		>
			<span style={{ fontSize: 24, flexShrink: 0 }}>🚨</span>
			<div>
				<p
					style={{
						fontSize: 13,
						fontWeight: 700,
						color: 'var(--accent-red)',
						marginBottom: 6,
					}}
				>
					Wallet Address Flagged by GoPlus Security
				</p>
				<p
					style={{
						fontSize: 12,
						color: 'var(--text-secondary)',
						marginBottom: 8,
						fontFamily: 'monospace',
					}}
				>
					{address.slice(0, 10)}...{address.slice(-6)}
				</p>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
					{flags.map((flag, i) => (
						<p key={i} style={{ fontSize: 12, color: 'var(--accent-red)' }}>
							• {flag}
						</p>
					))}
				</div>
				<a
					href='https://gopluslabs.io'
					target='_blank'
					rel='noopener noreferrer'
					style={{
						fontSize: 11,
						color: 'var(--accent-blue)',
						marginTop: 8,
						display: 'inline-block',
					}}
				>
					View full report on GoPlus ↗
				</a>
			</div>
		</div>
	)
}
