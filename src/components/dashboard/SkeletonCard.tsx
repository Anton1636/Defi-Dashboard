export function SkeletonCard({ lines = 3 }: { lines?: number }) {
	return (
		<div className='card' style={{ padding: 20 }}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					marginBottom: 20,
				}}
			>
				<div className='skeleton' style={{ height: 14, width: '40%' }} />
				<div
					className='skeleton'
					style={{ height: 22, width: '20%', borderRadius: 20 }}
				/>
			</div>
			{Array.from({ length: lines }).map((_, i) => (
				<div
					key={i}
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						padding: '12px 0',
						borderBottom:
							i < lines - 1 ? '1px solid var(--border-primary)' : 'none',
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						<div
							className='skeleton'
							style={{ width: 36, height: 36, borderRadius: '50%' }}
						/>
						<div>
							<div
								className='skeleton'
								style={{ height: 13, width: 80, marginBottom: 6 }}
							/>
							<div className='skeleton' style={{ height: 11, width: 56 }} />
						</div>
					</div>
					<div style={{ textAlign: 'right' }}>
						<div
							className='skeleton'
							style={{ height: 13, width: 64, marginBottom: 6 }}
						/>
						<div className='skeleton' style={{ height: 11, width: 44 }} />
					</div>
				</div>
			))}
		</div>
	)
}
