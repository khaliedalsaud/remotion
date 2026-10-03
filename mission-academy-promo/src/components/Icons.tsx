const common = {
	fill: 'none',
	strokeWidth: 2.4,
	strokeLinecap: 'round' as const,
	strokeLinejoin: 'round' as const,
};

export const PILLAR_ICONS: React.FC<{color: string; size: number}>[] = [
	// Certified programs: open book
	({color, size}) => (
		<svg width={size} height={size} viewBox="0 0 48 48" stroke={color} {...common}>
			<path d="M24 12c-4-3-10-4-16-3v27c6-1 12 0 16 3 4-3 10-4 16-3V9c-6-1-12 0-16 3z" />
			<path d="M24 12v27" />
		</svg>
	),
	// Expert trainers: people
	({color, size}) => (
		<svg width={size} height={size} viewBox="0 0 48 48" stroke={color} {...common}>
			<circle cx="18" cy="16" r="6" />
			<path d="M6 38c0-7 5-12 12-12s12 5 12 12" />
			<circle cx="34" cy="18" r="5" />
			<path d="M32 27c6 0 10 4 10 10" />
		</svg>
	),
	// Applied learning: rocket
	({color, size}) => (
		<svg width={size} height={size} viewBox="0 0 48 48" stroke={color} {...common}>
			<path d="M28 8c7 0 12 5 12 12L26 34l-12-12L28 8z" />
			<circle cx="30" cy="18" r="3" />
			<path d="M14 22l-6 2 4 4M26 34l-2 6-4-4M12 36l-4 4" />
		</svg>
	),
	// Professional certificates: medal
	({color, size}) => (
		<svg width={size} height={size} viewBox="0 0 48 48" stroke={color} {...common}>
			<circle cx="24" cy="20" r="11" />
			<path d="M19 30l-4 12 9-4 9 4-4-12" />
			<path d="M20 20l3 3 6-6" />
		</svg>
	),
];
