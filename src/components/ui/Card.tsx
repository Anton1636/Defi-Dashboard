import React from 'react'

type AccentColor = 'blue' | 'purple' | 'green' | 'red' | 'amber'
type PaddingSize = 'xs' | 'sm' | 'md' | 'lg'
type RadiusSize = 'xs' | 'sm' | 'md'

interface CardProps {
	children: React.ReactNode
	accent?: AccentColor
	hover?: boolean
	padding?: PaddingSize
	radius?: RadiusSize
	className?: string
	style?: React.CSSProperties
	onClick?: () => void
}

const ACCENT_COLORS: Record<AccentColor, { rgb: string; hex: string }> = {
	blue: { rgb: '0,229,255', hex: '#00e5ff' },
	purple: { rgb: '123,97,255', hex: '#7b61ff' },
	green: { rgb: '74,222,128', hex: '#4ade80' },
	red: { rgb: '248,113,113', hex: '#f87171' },
	amber: { rgb: '251,191,36', hex: '#fbbf24' },
}

const PADDING_MAP: Record<PaddingSize, string> = {
	xs: 'var(--card-padding-sm)', // 12px
	sm: 'var(--card-padding-sm)', // 12px
	md: 'var(--card-padding)', // 16px
	lg: 'var(--card-padding-lg)', // 20px
}

const RADIUS_MAP: Record<RadiusSize, string> = {
	xs: 'var(--card-radius-xs)', // 7px
	sm: 'var(--card-radius-sm)', // 10px
	md: 'var(--card-radius)', // 14px
}

export function Card({
	children,
	accent,
	hover = true,
	padding = 'md',
	radius = 'md',
	className = '',
	style = {},
	onClick,
}: CardProps) {
	const borderBase = accent
		? `rgba(${ACCENT_COLORS[accent].rgb}, 0.15)`
		: 'var(--card-border)'
	const borderHovered = accent
		? `rgba(${ACCENT_COLORS[accent].rgb}, 0.32)`
		: 'var(--card-border-hover)'

	const handleMouseEnter = hover
		? (e: React.MouseEvent<HTMLDivElement>) => {
				e.currentTarget.style.borderColor = borderHovered
				e.currentTarget.style.boxShadow = 'var(--shadow-hover)'
				if (onClick) e.currentTarget.style.transform = 'translateY(-2px)'
			}
		: undefined

	const handleMouseLeave = hover
		? (e: React.MouseEvent<HTMLDivElement>) => {
				e.currentTarget.style.borderColor = borderBase
				e.currentTarget.style.boxShadow = 'none'
				e.currentTarget.style.transform = 'translateY(0)'
			}
		: undefined

	return (
		<div
			className={className}
			onClick={onClick}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			style={{
				background: 'var(--card-bg)',
				border: `1px solid ${borderBase}`,
				borderRadius: RADIUS_MAP[radius],
				padding: PADDING_MAP[padding],
				position: 'relative',
				overflow: 'hidden',
				boxShadow: 'var(--shadow-card)',
				cursor: onClick ? 'pointer' : 'default',
				transition: hover
					? 'border-color 0.2s, box-shadow 0.2s, transform 0.15s, background 0.15s'
					: undefined,
				...style,
			}}
		>
			{/* Accent top line */}
			{accent && (
				<div
					aria-hidden
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: 2,
						background: `linear-gradient(90deg, ${ACCENT_COLORS[accent].hex}, rgba(${ACCENT_COLORS[accent].rgb}, 0.2), transparent)`,
						pointerEvents: 'none',
					}}
				/>
			)}

			{children}
		</div>
	)
}

/* ─── Section label ─────────────────────────── */
interface SectionLabelProps {
	children: React.ReactNode
	accentDot?: AccentColor
}
export function SectionLabel({
	children,
	accentDot = 'blue',
}: SectionLabelProps) {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 8,
				fontSize: 9,
				fontWeight: 800,
				color: 'var(--text-tertiary)',
				letterSpacing: '0.18em',
				textTransform: 'uppercase',
				marginBottom: 12,
			}}
		>
			<span
				style={{
					color: ACCENT_COLORS[accentDot].hex,
					fontSize: 16,
					lineHeight: 1,
				}}
			>
				·
			</span>
			{children}
		</div>
	)
}

/* ─── Card header ───────────────────────────── */
interface CardHeaderProps {
	title: React.ReactNode
	subtitle?: React.ReactNode
	right?: React.ReactNode
}
export function CardHeader({ title, subtitle, right }: CardHeaderProps) {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'flex-start',
				justifyContent: 'space-between',
				marginBottom: 14,
				gap: 10,
			}}
		>
			<div>
				{typeof title === 'string' ? (
					<p
						style={{
							fontSize: 14,
							fontWeight: 800,
							color: 'var(--text-primary)',
						}}
					>
						{title}
					</p>
				) : (
					title
				)}
				{subtitle &&
					(typeof subtitle === 'string' ? (
						<p
							style={{
								fontSize: 11,
								color: 'var(--text-tertiary)',
								marginTop: 2,
							}}
						>
							{subtitle}
						</p>
					) : (
						subtitle
					))}
			</div>
			{right && <div style={{ flexShrink: 0 }}>{right}</div>}
		</div>
	)
}

/* ─── Stat cell ─────────────────────────────── */
interface StatCellProps {
	label: string
	value: React.ReactNode
	sub?: string
	valueColor?: string
	isLoading?: boolean
}
export function StatCell({
	label,
	value,
	sub,
	valueColor,
	isLoading,
}: StatCellProps) {
	if (isLoading) {
		return (
			<div
				style={{
					background: 'var(--surface-2)',
					borderRadius: 'var(--card-radius-sm)',
					padding: '10px 12px',
				}}
			>
				<div
					className='skeleton'
					style={{ height: 9, width: 60, marginBottom: 7 }}
				/>
				<div className='skeleton' style={{ height: 22, width: 80 }} />
			</div>
		)
	}
	return (
		<div
			style={{
				background: 'var(--surface-2)',
				borderRadius: 'var(--card-radius-sm)',
				padding: '10px 12px',
			}}
		>
			<p
				style={{
					fontSize: 9,
					color: 'var(--text-tertiary)',
					fontWeight: 700,
					textTransform: 'uppercase',
					letterSpacing: '0.08em',
					marginBottom: 5,
				}}
			>
				{label}
			</p>
			<div
				style={{
					fontSize: 15,
					fontWeight: 800,
					color: valueColor ?? 'var(--text-primary)',
					fontVariantNumeric: 'tabular-nums',
				}}
			>
				{value}
			</div>
			{sub && (
				<p
					style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 3 }}
				>
					{sub}
				</p>
			)}
		</div>
	)
}

/* ─── Badge ─────────────────────────────────── */
interface BadgeProps {
	children: React.ReactNode
	color?: AccentColor
	size?: 'sm' | 'md'
}
export function Badge({ children, color = 'blue', size = 'md' }: BadgeProps) {
	const c = ACCENT_COLORS[color]
	return (
		<span
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				padding: size === 'sm' ? '2px 7px' : '4px 10px',
				borderRadius: 20,
				fontSize: size === 'sm' ? 9 : 11,
				fontWeight: 800,
				background: `rgba(${c.rgb}, 0.10)`,
				border: `1px solid rgba(${c.rgb}, 0.22)`,
				color: c.hex,
				letterSpacing: '0.04em',
			}}
		>
			{children}
		</span>
	)
}
