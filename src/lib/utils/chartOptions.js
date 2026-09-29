export const CHART_YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

export const UNIT_OPTIONS = [
	{
		value: 'pct_gdp',
		label: '% of GDP',
		subtitle: 'As a percentage of GDP'
	},
	{
		value: 'usd_market',
		label: 'USD (Market Exchange Rates)',
		subtitle: 'USD, millions'
	},
	{
		value: 'usd_ppp',
		label: 'USD (PPP)',
		subtitle: 'USD, millions (purchasing power parity)'
	}
];

export function getUnitOption(value) {
	return UNIT_OPTIONS.find((option) => option.value === value);
}