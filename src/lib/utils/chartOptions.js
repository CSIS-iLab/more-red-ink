export const COMPONENT_COLORS = {
	directSubsidies: '#006EA9',
	otherTaxIncentives: '#86CDFB',
	rdTaxIncentives: '#E4A839',
	rdSupport: '#BA4896',
	belowMarketCredit: '#246C54',
	stateInvestmentFunds: '#E98CA0',
	governmentProcurement: '#58C2A2',
	soeNetPayables: '#D25342',
	land: '#7F7575',
	debtEquitySwaps: '#A69644'
};

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
		label: 'US$ (PPP)',
		subtitle: 'US$, millions (purchasing power parity)'
	}
];

export function getUnitOption(value) {
	return UNIT_OPTIONS.find((option) => option.value === value);
}