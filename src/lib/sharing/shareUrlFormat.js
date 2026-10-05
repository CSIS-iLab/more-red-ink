/**
 * Compact share URL format.
 *
 * Responsibilities:
 * - Define the short query-parameter names used in share URLs.
 * - Define how each descriptive value is encoded in, and decoded from, a URL.
 *
 * Implementation notes:
 * - Only buildShareUrl.js and parseShareUrl.js should import this file.
 *   The rest of the application works with descriptive values.
 * - Decoding never guesses: an unknown or malformed value decodes to
 *   undefined so the parser can reject it.
 *
 * Example:
 *   /share?m=u&ce=soe&co=x&bc=s&sf=10&gp=tg&c=y&y=2022&u=gdp&sc=1&s100=0
 */

/**
 * Encode/decode a fixed set of descriptive values as short codes.
 */
const codeMap = (codesByValue) => {
	const valuesByCode = Object.fromEntries(
		Object.entries(codesByValue).map(([value, code]) => [code, value])
	);

	return {
		encode: (value) => codesByValue[value],
		decode: (code) => (Object.hasOwn(valuesByCode, code) ? valuesByCode[code] : undefined)
	};
};

const booleanCode = {
	encode: (value) => (value === true ? '1' : value === false ? '0' : undefined),
	decode: (code) => (code === '1' ? true : code === '0' ? false : undefined)
};

const yearCode = {
	encode: (value) => (Number.isInteger(value) ? String(value) : undefined),
	decode: (code) => (/^\d{4}$/.test(code) ? Number(code) : undefined)
};

// Economy names are stored as-is (URLSearchParams handles escaping) and
// checked against the source data by the Share page.
const textCode = {
	encode: (value) => (typeof value === 'string' && value !== '' ? value : undefined),
	decode: (code) => (code !== '' ? code : undefined)
};

export const MODE = {
	param: 'm',
	...codeMap({ fastTrack: 'f', userDriven: 'u' })
};

export const CHART = {
	param: 'c',
	...codeMap({
		historical: 'h',
		cumulative: 'c',
		yearSpecific: 'y',
		economySpecific: 'e'
	})
};

export const FAST_TRACK_CHOICE = {
	param: 'ft',
	...codeMap({ minimum: 'min', maximum: 'max' })
};

/**
 * User Driven assumptions, keyed by their calculatorState names.
 */
export const USER_DRIVEN_CHOICES = {
	chinaEstimationApproach: {
		param: 'ce',
		...codeMap({ industryBased: 'ind', soeAdvantage: 'soe' })
	},
	chinaOther: {
		param: 'co',
		...codeMap({ includeAll: 'in', excludeAll: 'x' })
	},
	belowMarketCredit: {
		param: 'bc',
		...codeMap({ stock: 's', flow: 'f' })
	},
	stateInvestmentFunds: {
		param: 'sf',
		...codeMap({ tenPercent: '10', oneHundredPercent: '100' })
	},
	procurementCoverage: {
		param: 'gp',
		...codeMap({ allItems: 'all', totalGoods: 'tg', centralGoods: 'cg', excludeAll: 'x' })
	}
};

/**
 * Chart display settings, keyed by their calculatorState names.
 */
export const DISPLAY_SETTINGS = {
	unit: {
		param: 'u',
		...codeMap({ pct_gdp: 'gdp', usd_market: 'mkt', usd_ppp: 'ppp' })
	},
	year: { param: 'y', ...yearCode },
	economy: { param: 'ec', ...textCode },
	showComponents: { param: 'sc', ...booleanCode },
	scaleTo100: { param: 's100', ...booleanCode }
};
