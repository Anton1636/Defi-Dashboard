'use client'

import dynamic from 'next/dynamic'
import { GasWidget } from '@/components/analytics/GasWidget'
import { GasSuggestions } from '@/components/analytics/GasSuggestions'

const TransactionSimulator = dynamic(
	() =>
		import('@/components/simulator/TransactionSimulator').then(
			m => m.TransactionSimulator,
		),
	{
		ssr: false,
		loading: () => (
			<div
				style={{
					background: 'rgba(255,255,255,.02)',
					border: '1px solid rgba(255,255,255,.07)',
					borderRadius: 16,
					padding: 20,
				}}
			>
				<div
					className='skeleton'
					style={{ height: 14, width: '40%', marginBottom: 16 }}
				/>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(3,1fr)',
						gap: 10,
					}}
				>
					{[0, 1, 2, 3, 4, 5].map(i => (
						<div
							key={i}
							className='skeleton'
							style={{ height: 72, borderRadius: 10 }}
						/>
					))}
				</div>
			</div>
		),
	},
)

const ILVisualizer = dynamic(
	() => import('@/components/analytics/ILVisualizer').then(m => m.ILVisualizer),
	{ ssr: false },
)

export default function AnalyticsPage() {
	return (
		<div className='fade-in' style={{ width: '100%', maxWidth: '100%' }}>
			{/* Header */}
			<div style={{ marginBottom: 24 }}>
				<h1
					style={{
						fontSize: 24,
						fontWeight: 900,
						color: 'var(--text-primary)',
						letterSpacing: '-0.8px',
						marginBottom: 4,
					}}
				>
					Analytics
				</h1>
				<p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
					Gas prices, optimization, transaction simulator and IL calculator
				</p>
			</div>

			{/* Gas Widget */}
			<div style={{ marginBottom: 14 }}>
				<GasWidget />
			</div>

			{/* Optimization Suggestions */}
			<div style={{ marginBottom: 14 }}>
				<GasSuggestions />
			</div>

			{/* Transaction Simulator */}
			<div style={{ marginBottom: 14 }}>
				<TransactionSimulator />
			</div>

			{/* IL Visualizer */}
			<ILVisualizer />
		</div>
	)
}
