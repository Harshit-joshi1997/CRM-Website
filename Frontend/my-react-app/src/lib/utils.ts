// Utility to merge class names (like clsx or classnames)
export function cn(...inputs: (string | undefined | false | null)[]): string {
	return inputs.filter(Boolean).join(' ');
}
