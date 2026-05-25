'use client'

import { GasWidget } from '@/components/analytics/GasWidget'
import { GasSuggestions } from '@/components/analytics/GasSuggestions'
import { TransactionSimulator } from '@/components/simulator/TransactionSimulator'
import { useMode } from '@/hooks/useMode'

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
						? 'Gas = transaction fee on Ethereum. Lower gas = cheaper to act.'
						: 'Gas prices, optimization suggestions and transaction simulator'}
				</p>
			</div>

			{/* Gas widget */}
			<div style={{ marginBottom: 24 }}>
				<GasWidget />
			</div>

			{/* Simple mode explainer */}
			{isSimple && (
				<div
					style={{
						background: 'var(--accent-blue-glow)',
						border: '1px solid var(--border-accent)',
						borderRadius: 12,
						padding: '12px 16px',
						marginBottom: 24,
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
			<GasSuggestions />

			{/* Transaction Simulator */}
			<TransactionSimulator />
		</div>
	)
}
