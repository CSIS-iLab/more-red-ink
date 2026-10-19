/**
 * Shared content for the Receipt (the assumptions summary shown beside the
 * charts and on the Share page).
 *
 * Responsibilities:
 * - Define the Receipt's introductions and column headers.
 * - Define the text shown for each spending tool, for every combination of
 *   assumptions that affects it.
 *
 * Implementation notes:
 * - Keep presentation copy here, not in Receipt.svelte.
 * - Rows are listed in spendingComponents.js order.
 * - A cell is either fixed text, or { by, text } where `by` names a choice
 *   ('mode', 'fastTrackChoice', or a User Driven choice) and `text` maps
 *   each value of that choice to more cell content. Use getReceiptText().
 * - When a row's China and Other Economies text match, the Receipt shows
 *   them as one merged cell.
 */

const WTO_AND_BUDGETS = 'Data from reports to the WTO and national budgets.';
const OECD = 'Data provided by the OECD, supplemented by national data for some economies.';
const EXCLUDED = 'Excluded from the estimate.';
const NOT_INCLUDED = 'Not included in estimate.';

export const receiptContent = {
	/**
	 * Introduction shown above the Receipt on the Visualizer.
	 */
	intro: {
		label: 'Your Industrial Policy Spending Estimates',
		description: [
			'The charts report your estimates of industrial policy spending for each economy based on the assumptions you made. The totals for each year are the sum of the various tools listed in the table below.',
			'The table below describes the methodology and assumptions behind your current estimates. Adjusting the assumptions affects the estimated final totals. If you change the assumptions, the calculator will update the table and charts.'
		]
	},

	/**
	 * Introduction shown above the Receipt on the Share page, where the
	 * reader is viewing someone else's estimate.
	 */
	shareIntro: {
		label: 'Understanding Industrial Policy Spending',
		description: [
			'The assumptions below were used to calculate the industrial policy spending estimate represented in the chart.'
		]
	},

	columns: {
		component: 'Spending Tool',
		china: 'Descriptions for China',
		otherEconomies: 'Descriptions for the Other Economies'
	},

	/**
	 * One entry per spending component. `label` is optional; it defaults to
	 * the component label in spendingComponents.js.
	 */
	rows: {
		directSubsidies: {
			china: {
				by: 'mode',
				text: {
					userDriven: {
						by: 'chinaEstimationApproach',
						text: {
							industryBased:
								'Industry-Based: Listed-firm subsidy data, scaled up to all industrial firms based on average subsidies received by industry.',
							soeAdvantage:
								'SOE Advantage: Listed-firm subsidy data scaled up to all industrial firms based on state ownership.'
						}
					},
					fastTrack: {
						by: 'fastTrackChoice',
						text: {
							minimum:
								'SOE Advantage: Listed-firm subsidy data scaled up to all industrial firms based on state ownership.',
							maximum:
								'Industry-Based: Listed-firm subsidy data, scaled up to all industrial firms based on average subsidies received by industry.'
						}
					}
				}
			},
			otherEconomies: WTO_AND_BUDGETS
		},

		otherTaxIncentives: {
			china: {
				by: 'mode',
				text: {
					userDriven: {
						by: 'chinaEstimationApproach',
						text: {
							industryBased:
								'Industry-Based: Listed-firm subsidy data scaled up to all industrial firms based on average tax incentives by industry.',
							soeAdvantage:
								'SOE Advantage: Listed-firm subsidy data scaled up to all industrial firms based on average tax incentives by ownership category; assumes unlisted private firms are subsidized at half the rate as their listed peers.'
						}
					},
					fastTrack: {
						by: 'fastTrackChoice',
						text: {
							minimum:
								'SOE Advantage: Listed-firm subsidy data scaled up to all industrial firms based on average tax incentives by ownership category; assumes unlisted private firms are subsidized at half the rate as their listed peers.',
							maximum:
								'Industry-Based: Listed-firm subsidy data scaled up to all industrial firms based on average tax incentives by industry.'
						}
					}
				}
			},
			otherEconomies: WTO_AND_BUDGETS
		},

		rdTaxIncentives: {
			china: OECD,
			otherEconomies: OECD
		},

		rdSupport: {
			china: OECD,
			otherEconomies: OECD
		},

		belowMarketCredit: {
			label: 'Below-Market Credit (Stock)',
			china: {
				by: 'mode',
				text: {
					userDriven: {
						by: 'chinaEstimationApproach',
						text: {
							industryBased: 'Industry-Based: Total loans issued below loan prime rate.',
							soeAdvantage:
								'SOE Advantage: Estimate based on outstanding credit to SOEs, including loans and bonds.'
						}
					},
					fastTrack: {
						by: 'fastTrackChoice',
						text: {
							minimum:
								'SOE Advantage: Estimate based on outstanding credit to SOEs, including loans and bonds.',
							maximum: 'Industry-Based: Total loans issued below loan prime rate.'
						}
					}
				}
			},
			otherEconomies:
				'Outstanding Credit: Interest savings on all outstanding state-backed credit, measured as the spread between state and market rates.'
		},

		stateInvestmentFunds: {
			china: {
				by: 'mode',
				text: {
					userDriven: {
						by: 'stateInvestmentFunds',
						text: {
							tenPercent: '10% of equity funding from state institutions.',
							oneHundredPercent: '100% of equity funding from state institutions.'
						}
					},
					fastTrack: {
						by: 'fastTrackChoice',
						text: {
							minimum: '10% of equity funding from state institutions.',
							maximum: '100% of equity funding from state institutions.'
						}
					}
				}
			},
			otherEconomies: {
				by: 'mode',
				text: {
					userDriven: {
						by: 'stateInvestmentFunds',
						text: {
							tenPercent: '10% of equity funding from state institutions.',
							oneHundredPercent: '100% of equity funding from state institutions.'
						}
					},
					fastTrack: {
						by: 'fastTrackChoice',
						text: {
							minimum: '10% of equity funding from state institutions.',
							maximum: '100% of equity funding from state institutions.'
						}
					}
				}
			}
		},

		governmentProcurement: {
			china: {
				by: 'mode',
				text: {
					userDriven: {
						by: 'procurementCoverage',
						text: {
							allItems:
								'Total: Includes all procurement reported to the WTO (or national sources where unavailable) including goods, services, and construction.',
							totalGoods:
								'Total Goods: Includes all goods procurement reported to the WTO (or national sources where unavailable).',
							centralGoods:
								'Central Goods: Includes all goods procurement at the central government level reported to the WTO (or national sources where unavailable).',
							excludeAll: 'Excluded: procurement not counted.'
						}
					},
					fastTrack: {
						by: 'fastTrackChoice',
						text: {
							minimum: 'Excluded: procurement not counted.',
							maximum:
								'Total: Includes all procurement reported to the WTO (or national sources where unavailable) including goods, services, and construction.'
						}
					}
				}
			},
			otherEconomies: {
				by: 'mode',
				text: {
					userDriven: {
						by: 'procurementCoverage',
						text: {
							allItems:
								'Total: Includes all procurement reported to the WTO (or national sources where unavailable) including goods, services, and construction.',
							totalGoods:
								'Total Goods: Includes all goods procurement reported to the WTO (or national sources where unavailable).',
							centralGoods:
								'Central Goods: Includes all goods procurement at the central government level reported to the WTO (or national sources where unavailable).',
							excludeAll: 'Excluded: procurement not counted.'
						}
					},
					fastTrack: {
						by: 'fastTrackChoice',
						text: {
							minimum: 'Excluded: procurement not counted.',
							maximum:
								'Total: Includes all procurement reported to the WTO (or national sources where unavailable) including goods, services, and construction.'
						}
					}
				}
			}
		},

		soeNetPayables: {
			china: {
				by: 'mode',
				text: {
					userDriven: {
						by: 'soeNetPayables',
						text: {
							include: 'Measures the benefit to SOEs from delayed repayment to suppliers.',
							exclude: EXCLUDED
						}
					},
					fastTrack: {
						by: 'fastTrackChoice',
						text: {
							minimum: EXCLUDED,
							maximum: 'Measures the benefit to SOEs from delayed repayment to suppliers.'
						}
					}
				}
			},
			otherEconomies: NOT_INCLUDED
		},

		land: {
			china: {
				by: 'mode',
				text: {
					userDriven: {
						by: 'land',
						text: {
							include: 'Measures the implied subsidy from below-market industrial land sales.',
							exclude: EXCLUDED
						}
					},
					fastTrack: {
						by: 'fastTrackChoice',
						text: {
							minimum: EXCLUDED,
							maximum: 'Measures the implied subsidy from below-market industrial land sales.'
						}
					}
				}
			},
			otherEconomies: NOT_INCLUDED
		},

		debtEquitySwaps: {
			china: {
				by: 'mode',
				text: {
					userDriven: {
						by: 'debtEquitySwaps',
						text: {
							include:
								'Measures the benefit of debt converted to equity as the savings on the original loans.',
							exclude: EXCLUDED
						}
					},
					fastTrack: {
						by: 'fastTrackChoice',
						text: {
							minimum: EXCLUDED,
							maximum:
								'Measures the benefit of debt converted to equity as the savings on the original loans.'
						}
					}
				}
			},
			otherEconomies: NOT_INCLUDED
		}
	}
};

/**
 * Resolve a Receipt cell (or label) to text for the given choices:
 * { mode, fastTrackChoice, ...userDrivenChoices }.
 *
 * Returns null when a needed choice is missing or unrecognized, so the
 * Receipt can show a placeholder instead of guessing.
 */
export function getReceiptText(content, choices) {
	if (content === undefined || content === null) {
		return null;
	}

	if (typeof content === 'string') {
		return content;
	}

	const value = choices[content.by];

	return Object.hasOwn(content.text, value) ? getReceiptText(content.text[value], choices) : null;
}
