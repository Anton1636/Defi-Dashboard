interface SecurityBadgeProps {
	flags: string[]
	compact?: boolean
}

export function SecurityBadge({ flags, compact = false }: SecurityBadgeProps) {
	if (flags.length === 0) {
		return (
			<span
				style={{
					fontSize: 11,
					color: 'var(--accent-green)',
					display: 'flex',
					alignItems: 'center',
					gap: 4,
				}}
			>
				✓ {compact ? '' : 'GoPlus verified safe'}
			</span>
		)
	}

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			{flags.map((flag, i) => (
				<span
					key={i}
					style={{
						fontSize: 10,
						fontWeight: 500,
						color: 'var(--accent-red)',
						background: 'var(--accent-red-glow)',
						padding: '2px 6px',
						borderRadius: 6,
						display: 'inline-block',
					}}
				>
					⚠ {flag}
				</span>
			))}
		</div>
	)
}
