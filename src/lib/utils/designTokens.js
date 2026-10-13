/**
 * Read design tokens (CSS custom properties from src/styles) in JavaScript,
 * for code such as Highcharts that needs actual values instead of var().
 * Browser only.
 */

/**
 * A token's value, e.g. readToken('--color-text-primary') → '#020618'.
 */
export const readToken = (name) =>
	getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * A type-scale token (defined in rem) as pixels. Read at render time so the
 * smaller type scale applies on narrow screens.
 */
export const readFontSize = (name) => {
	const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

	return `${parseFloat(readToken(name)) * rootSize}px`;
};
