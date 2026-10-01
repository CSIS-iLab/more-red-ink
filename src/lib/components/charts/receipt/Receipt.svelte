<script>
	import { assumptionOptions, fastTrackOptions } from '$lib/utils/assumptionOptions.js';
	import { spendingComponents } from '$lib/utils/spendingComponents.js';

	let { mode, assumptions } = $props();

	const findOption = (config, value) => {
		return config.options.find((option) => option.value === value);
	};

	const getUserDrivenLabel = (key) => {
		const config = assumptionOptions[key];
		const value = assumptions?.[key];

		return config && value ? (findOption(config, value)?.label ?? '—') : '—';
	};

	const getFastTrackLabel = () => {
		return findOption(fastTrackOptions, assumptions)?.label ?? '—';
	};

	const rows = $derived.by(() => {
		if (mode === 'userDriven') {
			return [
				{
					key: 'directSubsidies',
					label: spendingComponents.directSubsidies.label,
					china: getUserDrivenLabel('chinaEstimationApproach'),
					otherEconomies: '—'
				},
				{
					key: 'otherTaxIncentives',
					label: spendingComponents.otherTaxIncentives.label,
					china: getUserDrivenLabel('chinaEstimationApproach'),
					otherEconomies: '—'
				},
				{
					key: 'rdTaxIncentives',
					label: spendingComponents.rdTaxIncentives.label,
					shared: 'Included'
				},
				{
					key: 'rdSupport',
					label: spendingComponents.rdSupport.label,
					shared: 'Included'
				},
				{
					key: 'belowMarketCredit',
					label: spendingComponents.belowMarketCredit.label,
					shared: getUserDrivenLabel('belowMarketCredit')
				},
				{
					key: 'stateInvestmentFunds',
					label: spendingComponents.stateInvestmentFunds.label,
					shared: getUserDrivenLabel('stateInvestmentFunds')
				},
				{
					key: 'governmentProcurement',
					label: spendingComponents.governmentProcurement.label,
					china: getUserDrivenLabel('procurementCoverage'),
					otherEconomies: getUserDrivenLabel('procurementCoverage')
				},
				{
					key: 'soeNetPayables',
					label: spendingComponents.soeNetPayables.label,
					china: getUserDrivenLabel('chinaOther'),
					otherEconomies: 'Not applicable'
				},
				{
					key: 'land',
					label: spendingComponents.land.label,
					china: getUserDrivenLabel('chinaOther'),
					otherEconomies: 'Not applicable'
				},
				{
					key: 'debtEquitySwaps',
					label: spendingComponents.debtEquitySwaps.label,
					china: getUserDrivenLabel('chinaOther'),
					otherEconomies: 'Not applicable'
				}
			];
		}

		if (mode === 'fastTrack') {
			const choice = getFastTrackLabel();
			const isMaximum = assumptions === 'maximum';

			return [
				{
					key: 'directSubsidies',
					label: spendingComponents.directSubsidies.label,
					china: choice,
					otherEconomies: '—'
				},
				{
					key: 'otherTaxIncentives',
					label: spendingComponents.otherTaxIncentives.label,
					china: choice,
					otherEconomies: '—'
				},
				{
					key: 'rdTaxIncentives',
					label: spendingComponents.rdTaxIncentives.label,
					shared: 'Included'
				},
				{
					key: 'rdSupport',
					label: spendingComponents.rdSupport.label,
					shared: 'Included'
				},
				{
					key: 'belowMarketCredit',
					label: spendingComponents.belowMarketCredit.label,
					shared: choice
				},
				{
					key: 'stateInvestmentFunds',
					label: spendingComponents.stateInvestmentFunds.label,
					shared: choice
				},
				{
					key: 'governmentProcurement',
					label: spendingComponents.governmentProcurement.label,
					china: isMaximum ? 'Maximum' : 'Excluded',
					otherEconomies: isMaximum ? 'Maximum' : 'Excluded'
				},
				{
					key: 'soeNetPayables',
					label: spendingComponents.soeNetPayables.label,
					china: isMaximum ? 'Included' : 'Excluded',
					otherEconomies: 'Not applicable'
				},
				{
					key: 'land',
					label: spendingComponents.land.label,
					china: isMaximum ? 'Included' : 'Excluded',
					otherEconomies: 'Not applicable'
				},
				{
					key: 'debtEquitySwaps',
					label: spendingComponents.debtEquitySwaps.label,
					china: isMaximum ? 'Included' : 'Excluded',
					otherEconomies: 'Not applicable'
				}
			];
		}

		return [];
	});
</script>

<section class="receipt">
	<div class="receipt__intro">
		<h2 class="text-heading-3">Understanding Industrial Policy Spending</h2>

		<p class="text-label-small">
			The assumptions below were used to calculate the industrial policy spending estimate
			represented in the charts.
		</p>
	</div>

	<div class="receipt__table-wrapper">
		<table class="receipt__table">
			<thead>
				<tr>
					<th scope="col" class="text-label-x-small">Spending Component</th>
					<th scope="col" class="text-label-x-small">Assumption for China</th>
					<th scope="col" class="text-label-x-small">Assumption for Other Economies</th>
				</tr>
			</thead>

			<tbody>
				{#each rows as row (row.key)}
					<tr>
						<th scope="row">{row.label}</th>

						{#if row.shared}
							<td colspan="2">{row.shared}</td>
						{:else}
							<td>{row.china}</td>
							<td>{row.otherEconomies}</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<style>
	.receipt {
		width: 100%;
		min-width: 0;
	}

	.receipt__intro {
		margin-bottom: 2rem;
	}

	.receipt__intro h2 {
		margin: 0 0 0.75rem;
		line-height: 1.15;
	}

	.receipt__intro p {
		margin: 0;
		line-height: 1.45;
	}

	.receipt__table-wrapper {
		width: 100%;
		overflow-x: auto;
	}

	.receipt__table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
		table-layout: fixed;
	}

	.receipt__table th,
	.receipt__table td {
		padding: 0.75rem;
		text-align: left;
		vertical-align: top;
		line-height: 1.25;
	}

	.receipt__table thead th {
		padding: 6px;
		vertical-align: bottom;
		color: var(--color-neutral-600);
	}

	.receipt__table thead th:first-child {
		width: 36%;
	}

	.receipt__table thead th:nth-child(2),
	.receipt__table thead th:nth-child(3) {
		width: 32%;
	}

	.receipt__table tbody th,
	.receipt__table tbody td {
		border-right: 2px solid var(--color-bg);
		border-bottom: 2px solid var(--color-bg);
		background: #dce6f3;
	}

	.receipt__table tbody th {
		font-weight: 600;
	}

	.receipt__table tbody tr:first-child th,
	.receipt__table tbody tr:first-child td {
		border-top: 2px solid var(--color-bg);
	}

	.receipt__table tbody th:first-child {
		border-left: 2px solid var(--color-bg);
	}

	@media (max-width: 600px) {
		.receipt__intro h2 {
			font-size: 1.75rem;
		}

		.receipt__table {
			min-width: 36rem;
		}
	}
</style>
