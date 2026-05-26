'use client'

import dynamic from 'next/dynamic'
import { GasWidget } from '@/components/analytics/GasWidget'
import { GasSuggestions } from '@/components/analytics/GasSuggestions'
import { useMode } from '@/hooks/useMode'

const TransactionSimulator = dynamic(
	() =>
		import('@/components/simulator/TransactionSimulator').then(
			m => m.TransactionSimulator,
		),
	{ ssr: false },
)

const ILVisualizer = dynamic(
	() => import('@/components/analytics/ILVisualizer').then(m => m.ILVisualizer),
	{ ssr: false },
)

export default function AnalyticsPage() {
	const { isSimple } = useMode()

	return (
		<div className='fade-in' style={{ maxWidth: 860 }}>
			{/* Header */}
			<div style={{ marginBottom: 28 }}>
				<h1
					style={{
						fontSize: 24,
						fontWeight: 700,
						color: 'var(--text-primary)',
						letterSpacing: '-0.5px',
						marginBottom: 4,
					}}
				>
					Analytics
				</h1>
				<p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
					{isSimple
						? 'Gas fees, transaction preview and liquidity analysis'
						: 'Gas prices, optimization, transaction simulator and IL calculator'}
				</p>
			</div>

			{/* Gas widget */}
			<GasWidget />

			{/* Simple mode explainer */}
			{isSimple && (
				<div
					style={{
						background: 'var(--accent-blue-glow)',
						border: '1px solid var(--border-accent)',
						borderRadius: 12,
						padding: '12px 16px',
						margin: '16px 0',
						fontSize: 13,
						color: 'var(--text-secondary)',
						lineHeight: 1.6,
					}}
				>
					💡{' '}
					<strong style={{ color: 'var(--text-primary)' }}>What is gas?</strong>{' '}
					Every action on Ethereum costs a small fee called gas. It changes
					based on network activity.
				</div>
			)}

			{/* Gas Suggestions */}
			<div style={{ marginTop: 24 }}>
				<GasSuggestions />
			</div>

			{/* Transaction Simulator */}
			<TransactionSimulator />

			{/* IL Visualizer */}
			<ILVisualizer />
		</div>
	)
}
