interface EmptyStateProps {
	icon: string
	title: string
	description: string
	action?: {
		label: string
		onClick: () => void
	}
}

export function EmptyState({
	icon,
	title,
	description,
	action,
}: EmptyStateProps) {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '64px 24px',
				textAlign: 'center',
			}}
		>
			{/* Icon з subtle glow */}
			<div
				style={{
					fontSize: 40,
					marginBottom: 16,
					opacity: 0.4,
					filter: 'grayscale(30%)',
				}}
			>
				{icon}
			</div>

			<p
				style={{
					fontSize: 'var(--text-md)',
					fontWeight: 600,
					color: 'var(--text-secondary)',
					marginBottom: 8,
				}}
			>
				{title}
			</p>

			<p
				style={{
					fontSize: 'var(--text-sm)',
					color: 'var(--text-tertiary)',
					maxWidth: 280,
					lineHeight: 1.6,
					marginBottom: action ? 24 : 0,
				}}
			>
				{description}
			</p>

			{action && (
				<button
					onClick={action.onClick}
					style={{
						padding: '10px 20px',
						borderRadius: 10,
						fontSize: 'var(--text-sm)',
						fontWeight: 500,
						color: 'white',
						background: 'var(--gradient-blue)',
						border: 'none',
						cursor: 'pointer',
						boxShadow: 'var(--shadow-glow-blue)',
						transition: 'opacity 0.15s',
					}}
					onMouseEnter={e => {
						e.currentTarget.style.opacity = '0.85'
					}}
					onMouseLeave={e => {
						e.currentTarget.style.opacity = '1'
					}}
				>
					{action.label}
				</button>
			)}
		</div>
	)
}
