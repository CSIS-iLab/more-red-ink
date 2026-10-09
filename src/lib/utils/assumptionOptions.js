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
		label: 'China-Specific Assumptions',
		// TODO: Replace with final program copy.
		description: ''
	},
	{
		key: 'allEconomies',
		chinaOnly: false,
		label: 'Tools for Other Economies',
		description: 'The assumptions for estimating most industrial policy tools used by the other 7 economies are straightforward and fixed. But for some tools, there are reasonable alternative options.'
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
		description: [
			"Unlike the other economies, the most accurate data for two kinds of Chinese industrial policy spending - direct subsidies and other tax incentives - comes from reporting disclosures provided by listed firms. These figures are then used as a basis for creating estimates for unlisted Chinese firms, which account for a large [insert %] share of the country's economy.",
			'When analyzing these data, there are two reasonable alternative approaches to creating estimates, one based on company ownership, the other on industries.',
			'Pick the approach you believe better captures industrial policy dynamics.'
		],
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
		label: 'Other China-Specific Tools - Land, Debt-equity swaps, and SOE net payables',
		// TODO: Replace with final program copy.
		description:
			'There are some tools for which we only have estimates for China. Below-market land refers to the preferential sale of land to industrial firms and below market prices. In concrete terms we look at the difference in price between industrial land sold at competitive auction vs land sold through less competitive agreements. Debt-for-equity swaps refers to a policy where banks exchange their loans to a given company for equity shares. We measure the benefits to firms by assuming a spread the firms would have had to pay if these swaps were still loans. Ultimately, this is a small estimate. Finally, SOE net payables represents the savings SOEs accrue by delaying payment to suppliers.',
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
			'Below-market credit is measured as either the savings in interest-rate payments provided to priority recipients for all of their outstanding credit (“Stock”) or the total amount of priority lending they receive in any given year (“Flow”). The latter option is based on the possibility that receipt of preferential credit confers a more fundamental market-entry opportunity more significant than reduced loan repayment terms.',
		chinaOnly: false,
		options: [
			{
				value: 'stock',
				label: 'Stock',
				description:
					'“Stock” estimates below-market credit based on the spread between high-yield and investment-grade corporate bonds in each economy, which is then applied to the outstanding lending of state-backed financial institutions.'
			},
			{
				value: 'flow',
				label: 'Flow',
				description:
					'"Flow” estimates below-market credit based on the amount of annual new lending by state-backed financial institutions.'
			}
		]
	},
	stateInvestmentFunds: {
		label: 'State Investment Funds',
		description:
			'State investment funds are measured by either counting only 10% of their total as a subsidy, to reflect the likely difference between state-guided support and market-based equity investment, or by counting their entire value, which instead would reflect that state investment confers a more fundamental market-entry opportunity more significant than better investment terms.',
		chinaOnly: false,
		options: [
			{
				value: 'tenPercent',
				label: '10% of funding',
				description:
					'“10% of funding” uses 10% as a proxy for the relative benefit of receiving state-backed funding as opposed to relying on market-based funding sources.'
			},
			{
				value: 'oneHundredPercent',
				label: '100% of funding',
				description: '“100% of funding” treats the entire equity investment as valuable and tied to recipients’ basic access into a sector.'
			}
		]
	},
	procurementCoverage: {
		label: 'Government Procurement Coverage',
		description:
			['Government procurement is the most opaque of all industrial policy tools. Government procurement refers to purchases of goods, services, and construction work by public sector organizations. Governments can utilize their influence as large purchasers within an economy to provide benefits to firms through favorable terms. For our estimates, the Calculator automatically only counts 10 percent of each economy\'s actual reported total procurement as being in service of industrial policy.', 'Select what government procurement you consider to be most relevant for industrial policy:'],
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
	description: '',
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
