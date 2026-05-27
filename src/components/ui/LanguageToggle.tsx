'use client'

import { useTranslation } from '@/hooks/useTranslation'

export function LanguageToggle() {
	const { locale, setLocale } = useTranslation()

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				background: 'var(--bg-elevated)',
				border: '1px solid var(--border-primary)',
				borderRadius: 10,
				padding: 3,
				gap: 2,
			}}
		>
			{(['en', 'de'] as const).map(lang => {
				const isActive = locale === lang
				return (
					<button
						key={lang}
						onClick={() => setLocale(lang)}
						style={{
							padding: '5px 10px',
							borderRadius: 7,
							fontSize: 12,
							fontWeight: isActive ? 700 : 400,
							color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
							background: isActive ? 'var(--bg-card)' : 'transparent',
							border: isActive
								? '1px solid var(--border-secondary)'
								: '1px solid transparent',
							cursor: 'pointer',
							transition: 'all 0.15s',
							display: 'flex',
							alignItems: 'center',
							gap: 4,
						}}
					>
						<span style={{ fontSize: 14 }}>{lang === 'en' ? '🇬🇧' : '🇩🇪'}</span>
						{lang.toUpperCase()}
					</button>
				)
			})}
		</div>
	)
}
