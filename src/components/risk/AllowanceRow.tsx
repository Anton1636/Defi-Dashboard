import type { TokenAllowance } from '@/lib/allowances'

const RISK_CONFIG = {
	low: {
		color: 'var(--accent-green)',
		bg: 'var(--accent-green-glow)',
		border: 'rgba(16,185,129,0.2)',
		label: 'Low risk',
	},
	medium: {
		color: 'var(--accent-amber)',
		bg: 'rgba(245,158,11,0.08)',
		border: 'rgba(245,158,11,0.2)',
		label: 'Medium risk',
	},
	high: {
		color: 'var(--accent-red)',
		bg: 'var(--accent-red-glow)',
		border: 'rgba(239,68,68,0.2)',
		label: 'High risk',
	},
}

interface AllowanceRowProps {
	allowance: TokenAllowance
}

export function AllowanceRow({ allowance: a }: AllowanceRowProps) {
	const cfg = RISK_CONFIG[a.riskLevel]

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '12px 16px',
				background: 'var(--bg-elevated)',
				borderRadius: 10,
				gap: 12,
				transition: 'background 0.15s',
			}}
			onMouseEnter={e => {
				e.currentTarget.style.background = 'var(--bg-card-hover)'
			}}
			onMouseLeave={e => {
				e.currentTarget.style.background = 'var(--bg-elevated)'
			}}
		>
			{/* Left — token + spender */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 12,
					flex: 1,
					minWidth: 0,
				}}
			>
				{/* Token badge */}
				<div
					style={{
						width: 36,
						height: 36,
						borderRadius: 8,
						background: cfg.bg,
						border: `1px solid ${cfg.border}`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 11,
						fontWeight: 700,
						color: cfg.color,
						flexShrink: 0,
					}}
				>
					{a.token.slice(0, 4)}
				</div>

				<div style={{ minWidth: 0 }}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 6,
							marginBottom: 2,
						}}
					>
						<span
							style={{
								fontSize: 13,
								fontWeight: 600,
								color: 'var(--text-primary)',
							}}
						>
							{a.token}
						</span>
						<span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
							→
						</span>
						<span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
							{a.spender}
						</span>
						{!a.isKnownProtocol && (
							<span
								style={{
									fontSize: 10,
									color: 'var(--accent-red)',
									background: 'var(--accent-red-glow)',
									padding: '1px 6px',
									borderRadius: 10,
									fontWeight: 600,
								}}
							>
								UNVERIFIED
							</span>
						)}
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<span
							style={{
								fontSize: 11,
								color: a.isUnlimited
									? 'var(--accent-amber)'
									: 'var(--text-tertiary)',
								fontWeight: a.isUnlimited ? 600 : 400,
							}}
						>
							{a.amount}
						</span>
						<span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
							·
						</span>
						<span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
							Last used: {a.lastActivity}
						</span>
					</div>
				</div>
			</div>

			{/* Right — risk badge */}
			<div
				style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}
			>
				<span
					style={{
						fontSize: 11,
						fontWeight: 600,
						padding: '3px 10px',
						borderRadius: 20,
						background: cfg.bg,
						color: cfg.color,
						border: `1px solid ${cfg.border}`,
						whiteSpace: 'nowrap',
					}}
				>
					{cfg.label}
				</span>
				<button
					onClick={() =>
						window.open('https://revoke.cash', '_blank', 'noopener,noreferrer')
					}
					style={{
						fontSize: 11,
						color: 'var(--text-tertiary)',
						background: 'transparent',
						padding: '3px 10px',
						borderRadius: 8,
						border: '1px solid var(--border-primary)',
						cursor: 'pointer',
						transition: 'all 0.15s',
						whiteSpace: 'nowrap',
					}}
					onMouseEnter={e => {
						e.currentTarget.style.borderColor = 'var(--border-secondary)'
						e.currentTarget.style.color = 'var(--text-secondary)'
					}}
					onMouseLeave={e => {
						e.currentTarget.style.borderColor = 'var(--border-primary)'
						e.currentTarget.style.color = 'var(--text-tertiary)'
					}}
				>
					Revoke ↗
				</button>
			</div>
		</div>
	)
}
