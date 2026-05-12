export function SkeletonCard({ lines = 3 }: { lines?: number }) {
	return (
		<div
			style={{
				background: 'var(--gradient-card)',
				border: '1px solid var(--border-primary)',
				borderRadius: '16px',
				padding: '20px',
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					marginBottom: '16px',
				}}
			>
				<div
					style={{
						height: '14px',
						background: 'var(--bg-elevated)',
						borderRadius: '6px',
						width: '35%',
					}}
				/>
				<div
					style={{
						height: '22px',
						background: 'var(--bg-elevated)',
						borderRadius: '6px',
						width: '20%',
					}}
				/>
			</div>
			{Array.from({ length: lines }).map((_, i) => (
				<div
					key={i}
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						padding: '10px 0',
						borderBottom: '1px solid var(--border-primary)',
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
						<div
							style={{
								width: '32px',
								height: '32px',
								borderRadius: '50%',
								background: 'var(--bg-elevated)',
							}}
						/>
						<div>
							<div
								style={{
									height: '12px',
									background: 'var(--bg-elevated)',
									borderRadius: '4px',
									width: '80px',
									marginBottom: '6px',
								}}
							/>
							<div
								style={{
									height: '10px',
									background: 'var(--bg-elevated)',
									borderRadius: '4px',
									width: '56px',
								}}
							/>
						</div>
					</div>
					<div style={{ textAlign: 'right' }}>
						<div
							style={{
								height: '12px',
								background: 'var(--bg-elevated)',
								borderRadius: '4px',
								width: '64px',
								marginBottom: '6px',
							}}
						/>
						<div
							style={{
								height: '10px',
								background: 'var(--bg-elevated)',
								borderRadius: '4px',
								width: '48px',
							}}
						/>
					</div>
				</div>
			))}
		</div>
	)
}
