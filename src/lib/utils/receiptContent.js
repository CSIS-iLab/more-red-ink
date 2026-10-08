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
 * - Rows are listed in spendingComponents.js order, which is also the chart
 *   stacking order, so a legend-style Receipt lines up with the charts.
 * - A cell is either fixed text, or { by, text } where `by` names a choice
 *   ('mode', 'fastTrackChoice', or a User Driven choice) and `text` maps
 *   each value of that choice to more cell content. Use getReceiptText().
 * - When a row's China and Other Economies text match, the Receipt shows
 *   them as one merged cell.
 *
 * TODO: Receipt copy is under program review. Text from the approved Figma
 * design is used as-is; text marked "Draft" covers combinations the design
 * doesn't show and was adapted from assumptionOptions.js.
 */

const WTO_AND_BUDGETS = 'Data from reports to the WTO and national budgets.';
const OECD = 'Data provided by the OECD, supplemented by national data for some economies.';
const EXCLUDED = 'Excluded from the estimate.';
const LESS_COMMON = 'Assumed far less common in the other economies.';

export const receiptContent = {
	/**
	 * Introduction shown above the Receipt on the Visualizer.
	 */
	intro: {
		label: 'Your Industrial Policy Spending Estimates',
		description: [
			'The charts report your estimates of industrial policy spending for each economy based on the assumptions you made. The totals for each year are the sum of the various tools listed in the table below.',
			'The table below lists the assumptions behind your current estimates. Adjusting the assumptions affects the estimated final totals. If you change the assumptions, the Calculator will update the table and charts.'
		]
	},

	/**
	 * Introduction shown above the Receipt on the Share page, where the
	 * reader is viewing someone else's estimate.
	 */
	shareIntro: {
		label: 'Understanding Industrial Policy Spending',
		description: [
			'The assumptions below were used to calculate the industrial policy spending estimate represented in the charts.'
		]
	},

	columns: {
		component: 'Spending Tool',
		china: 'Assumptions for China',
		otherEconomies: 'Assumptions for Other Economies'
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
							// Draft
							industryBased:
								'Industry-Based: Listed-firm subsidy data scaled up to all industrial firms based on average subsidies by industry.',
							soeAdvantage:
								'SOE Advantage: Listed-firm subsidy data scaled up to all industrial firms based on state ownership.'
						}
					},
					fastTrack: {
						by: 'fastTrackChoice',
						text: {
							// Draft
							minimum: 'Minimum: The lower of the Industry-Based and SOE Advantage estimates.',
							maximum: 'Maximum: The higher of the Industry-Based and SOE Advantage estimates.'
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
							// Draft
							industryBased:
								'Industry-Based: Listed-firm tax incentive data scaled up to all industrial firms based on average tax incentives by industry.',
							soeAdvantage:
								'SOE Advantage: Listed-firm subsidy data scaled up to all industrial firms based on average tax incentives by ownership category. Assumes unlisted private firms are subsidized at half the rate as their listed peers.'
						}
					},
					fastTrack: {
						by: 'fastTrackChoice',
						text: {
							// Draft
							minimum: 'Minimum: The lower of the Industry-Based and SOE Advantage estimates.',
							maximum: 'Maximum: The higher of the Industry-Based and SOE Advantage estimates.'
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
			label: {
				by: 'mode',
				text: {
					userDriven: {
						by: 'belowMarketCredit',
						text: {
							stock: 'Below-Market Credit - Stock',
							flow: 'Below-Market Credit - Flow'
						}
					},
					fastTrack: 'Below-Market Credit'
				}
			},
			china: {
				by: 'mode',
				text: {
					userDriven: {
						by: 'belowMarketCredit',
						text: {
							stock: {
								by: 'chinaEstimationApproach',
								text: {
									// Draft
									industryBased:
										'Industry-Based: Estimate based on the proportion of loans below the loan prime rate, a benchmark lending rate within China.',
									soeAdvantage:
										'SOE Advantage: Estimate based on outstanding credit to SOEs, including loans and bonds.'
								}
							},
							// Draft
							flow: 'New Lending: Interest savings on new lending by state-backed financial institutions.'
						}
					},
					fastTrack: {
						by: 'fastTrackChoice',
						text: {
							// Draft
							minimum:
								'Minimum: The lowest of the outstanding credit, SOE Advantage, and new lending estimates.',
							maximum:
								'Maximum: The highest of the outstanding credit, SOE Advantage, and new lending estimates.'
						}
					}
				}
			},
			otherEconomies: {
				by: 'mode',
				text: {
					userDriven: {
						by: 'belowMarketCredit',
						text: {
							stock:
								'Outstanding Credit: Interest savings on all outstanding state-backed credit, measured as the spread between state and market rates.',
							// Draft
							flow: 'New Lending: Interest savings on new lending by state-backed financial institutions.'
						}
					},
					fastTrack: {
						by: 'fastTrackChoice',
						text: {
							// Draft
							minimum: 'Minimum: The lower of the outstanding credit and new lending estimates.',
							maximum: 'Maximum: The higher of the outstanding credit and new lending estimates.'
						}
					}
				}
			}
		},

		stateInvestmentFunds: {
			china: {
				by: 'mode',
				text: {
					userDriven: {
						by: 'stateInvestmentFunds',
						text: {
							tenPercent: '10% of equity funding from state institutions.',
							// Draft
							oneHundredPercent: '100% of equity funding from state institutions.'
						}
					},
					fastTrack: {
						by: 'fastTrackChoice',
						text: {
							// Draft
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
							// Draft
							oneHundredPercent: '100% of equity funding from state institutions.'
						}
					},
					fastTrack: {
						by: 'fastTrackChoice',
						text: {
							// Draft
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
							// Draft
							allItems:
								'All items: Includes all procurement reported to the WTO (or national sources where unavailable).',
							// Draft
							totalGoods:
								'Total goods: Includes all goods procurement reported to the WTO (or national sources where unavailable).',
							centralGoods:
								'Central goods: Includes all goods procurement at the central government level reported to the WTO (or national sources where unavailable).',
							excludeAll: EXCLUDED
						}
					},
					fastTrack: {
						by: 'fastTrackChoice',
						text: {
							minimum: EXCLUDED,
							// Draft
							maximum:
								'Maximum: The largest of the all items, total goods, and central goods estimates.'
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
							// Draft
							allItems:
								'All items: Includes all procurement reported to the WTO (or national sources where unavailable).',
							// Draft
							totalGoods:
								'Total goods: Includes all goods procurement reported to the WTO (or national sources where unavailable).',
							centralGoods:
								'Central goods: Includes all goods procurement at the central government level reported to the WTO (or national sources where unavailable).',
							excludeAll: EXCLUDED
						}
					},
					fastTrack: {
						by: 'fastTrackChoice',
						text: {
							minimum: EXCLUDED,
							// Draft
							maximum:
								'Maximum: The largest of the all items, total goods, and central goods estimates.'
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
						by: 'chinaOther',
						text: {
							includeAll: 'Measures the benefit to SOEs from delayed repayment to suppliers.',
							excludeAll: EXCLUDED
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
			otherEconomies: LESS_COMMON
		},

		land: {
			china: {
				by: 'mode',
				text: {
					userDriven: {
						by: 'chinaOther',
						text: {
							includeAll: 'Measures the implied subsidy from below-market industrial land sales.',
							excludeAll: EXCLUDED
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
			otherEconomies: LESS_COMMON
		},

		debtEquitySwaps: {
			china: {
				by: 'mode',
				text: {
					userDriven: {
						by: 'chinaOther',
						text: {
							includeAll:
								'Measures the benefit of debt converted to equity as the savings on the original loans.',
							excludeAll: EXCLUDED
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
			otherEconomies: LESS_COMMON
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
