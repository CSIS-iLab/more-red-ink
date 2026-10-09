/**
 * Shared metadata for calculator assumption options.
 *
 * Responsibilities:
 * - Define machine-readable values for assumption choices.
 * - Define human-readable labels and supporting text for those choices.
 * - Provide a single source of truth for forms, receipts, and other UI.
 *
 * Implementation notes:
 * - Keep presentation metadata here.
 * - Do not put spreadsheet column names or methodology resolution here.
 * - Methodology-specific data mapping belongs in calculateEstimate.js.
 */

/**
 * Introductory content shown at the top of the Fast Track and
 * User Driven assumption forms.
 *
 * Both forms share a label. Descriptions are keyed by calculator mode
 * and listed as paragraphs.
 */
export const assumptionsIntro = {
	label: 'Select Assumptions',
	// TODO: Replace with final program copy.
	descriptions: {
		fastTrack: [
			'This “Fast Track” option lets you look at the two extremes in our data - the upper-bound and lower-bound estimates.',
			'Select between lower- and upper-bound estimates for all the economies based on which assumptions would yield the lowest or highest estimates for China. The Minimum option is the most conservative; it excludes several China-specific factors and applies conservative assumptions on the potential scale of spending throughout. The Maximum option includes all of the potential tools using broader assumptions.'
		],
		userDriven: [
			'Select the underlying assumptions of the various industrial policy spending tools that together produce overall estimates for China and the seven other economies.'
		]
	}
};

/**
 * Sections that group the User Driven assumptions.
 *
 * Each assumption is placed in the section whose `chinaOnly` value
 * matches its own `chinaOnly` flag.
 */
export const assumptionSections = [
	{
		key: 'chinaOnly',
		chinaOnly: true,
		label: 'Variables for China Only',
		// TODO: Replace with final program copy.
		description:
			'Short description about why China has different variables and how they should be considered in the grand scheme of the industrial-policy...'
	},
	{
		key: 'allEconomies',
		chinaOnly: false,
		label: 'Variables for Other Economies',
		// TODO: Replace with final program copy.
		description: 'Short description about variables that apply to all 8 economies.'
	}
];

/**
 * Selectable assumptions used by the calculator.
 *
 * Each assumption defines its user-facing metadata, whether it is
 * China-specific, and the stable values available for user selection.
 */
export const assumptionOptions = {
	chinaEstimationApproach: {
		label: 'Estimation Approach',
		description: 'Which do you think is more influential in Chinese industrial policy',
		chinaOnly: true,
		options: [
			{
				value: 'industryBased',
				label: 'Industry-Based',
				description:
					'Our “industry-based” approach assumes that what industry a company is in is most predictive of the subsidies that it receives – listed or unlisted. We therefore use the average subsidies and other tax incentives received for each industry to create estimates for unlisted firms. Our estimate for below-market credit is based on the proportion of loans below the loan-prime rate, a benchmark lending rate within China.'
			},
			{
				value: 'soeAdvantage',
				label: 'State-Owned Enterprise Advantage',
				description:
					'Our “SOE-based” approach instead assumes that SOEs are substantial beneficiaries of industrial policy due to their state backing, particularly relative to unlisted private firms. For these estimates, we assume that unlisted private firms receive half the support their listed peers do, while unlisted SOEs receive the same level of support as their listed peers. For below-market credit, we measure the benefit that accrues to SOEs specifically through lending and bond issuance. We also include an estimate for the benefit that SOEs receive by delaying payment to suppliers – this is the “SOE Net Payables” variable.'
			}
		]
	},
	chinaOther: {
		label: 'Other Variables - SOE Net Payables, Land and Debt-Equity Swaps',
		// TODO: Replace with final program copy.
		description: '',
		chinaOnly: true,
		options: [
			{
				value: 'includeAll',
				label: 'Include All',
				description:
					'Include instruments that are unique to China and not necessarily comparable with the other 7 economies.'
			},
			{
				value: 'excludeAll',
				label: 'Exclude All',
				description: 'Exclude instruments that are unique to China.'
			}
		]
	},
	belowMarketCredit: {
		label: 'Below-Market Credit',
		description:
			'This variable captures the impact of below-market lending by state-backed institutions in our sample economies.',
		chinaOnly: false,
		options: [
			{
				value: 'stock',
				label: 'Stock',
				description:
					'This estimates below-market credit based on a spread between high-yield and investment-grade corporate bonds in our sample economies as a proxy for preferential lending. This is then applied to the outstanding lending amount for state-backed financial institutions.'
			},
			{
				value: 'flow',
				label: 'Flow',
				description:
					'This estimate is based on the amount of new lending by state-backed financial institutions.'
			}
		]
	},
	stateInvestmentFunds: {
		label: 'State Investment Funds',
		description:
			'This variable captures equity investments made by state investment funds for our sample economies.',
		chinaOnly: false,
		options: [
			{
				value: 'tenPercent',
				label: '10% of funding',
				description:
					'Includes only 10 percent of new equity investments made by state investment funds.'
			},
			{
				value: 'oneHundredPercent',
				label: '100% of funding',
				description: 'Includes all new equity investments made by state investment funds.'
			}
		]
	},
	procurementCoverage: {
		label: 'Government Procurement Coverage',
		description:
			'This variable captures the potential use of government procurement for industrial policy purposes.',
		chinaOnly: false,
		options: [
			{
				value: 'allItems',
				label: 'All Items',
				description: 'All procurement reported to the WTO (or national sources where unavailable).'
			},
			{
				value: 'totalGoods',
				label: 'Total Goods',
				description:
					'Total goods procurement reported to the WTO (or national sources where unavailable).'
			},
			{
				value: 'centralGoods',
				label: 'Central Goods',
				description:
					'Central government-level goods procurement reported to the WTO (or national sources where unavailable).'
			},
			{
				value: 'excludeAll',
				label: 'Exclude All',
				description: 'Exclude government procurement entirely.'
			}
		]
	}
};

/**
 * Informational metadata for spending components that are always
 * included in the estimate and do not require a user selection.
 */
export const alwaysIncluded = {
	label: 'Always Included: R&D Tax Incentives and R&D Support',
	description:
		'R&D tax incentives and other kinds of R&D support are core parts of industry policy for all of the economies, with most data provided by the OECD. The Calculator always includes these and offers no alternative options for estimation.'
};

/**
 * Fast Track assumption configuration.
 *
 * Defines the lower- and upper-bound estimate choices used by the
 * Fast Track workflow.
 */
export const fastTrackOptions = {
	// TODO: Replace with final program-provided variable name.
	label: '',
	description:
		'',
	options: [
		{
			value: 'minimum',
			label: 'Minimum',
			description:
				'“Minimum” is based on assumptions that produce the smallest possible estimate for China. This highly conservative option excludes some China-specific tools as well as government procurement.'
		},
		{
			value: 'maximum',
			label: 'Maximum',
			description:
				'“Maximum” is based on assumptions that produce the largest possible estimate for China. It is an upper-bound scenario that includes China-specific tools and government procurement and applies a broader definition of state support to create its estimate.'
		}
	]
};
