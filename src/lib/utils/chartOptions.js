/**
 * Design token for each spending component's color (defined in
 * src/styles/colors.css).
 */
export const COMPONENT_COLOR_TOKENS = {
	directSubsidies: '--color-spending-direct-subsidies',
	otherTaxIncentives: '--color-spending-other-tax-incentives',
	rdTaxIncentives: '--color-spending-rd-tax-incentives',
	rdSupport: '--color-spending-rd-support',
	belowMarketCredit: '--color-spending-below-market-credit',
	stateInvestmentFunds: '--color-spending-state-investment-funds',
	governmentProcurement: '--color-spending-gov-procurement',
	soeNetPayables: '--color-spending-soe-net-payables',
	land: '--color-spending-land',
	debtEquitySwaps: '--color-spending-debt-equity-swaps'
};

/**
 * Spending component colors for use in CSS (e.g. receipt swatches).
 * Highcharts needs resolved values: use getComponentColor() from chartTheme.js.
 */
export const COMPONENT_COLORS = Object.fromEntries(
	Object.entries(COMPONENT_COLOR_TOKENS).map(([key, token]) => [key, `var(${token})`])
);

export const CHART_YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

export const UNIT_OPTIONS = [
	{
		value: 'pct_gdp',
		label: '% of GDP',
		subtitle: 'As a percentage of GDP'
	},
	{
		value: 'usd_market',
		label: 'US$ (Market Exchange Rates)',
		subtitle: 'US$, millions'
	},
	{
		value: 'usd_ppp',
		label: 'US$ (purchasing power parity)',
		subtitle: 'US$, millions (purchasing power parity)'
	}
];

export function getUnitOption(value) {
	return UNIT_OPTIONS.find((option) => option.value === value);
}
