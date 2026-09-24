# More Red Ink --- Architecture & Development Notes

This document captures the current MRI file structure and the
architectural decisions made during pre-development stress testing. It
is intended to be a practical implementation reference, not a final
technical specification.

## Current File Tree

```
src/
├── lib/
│   ├── assets/
│   │   └── favicon.svg
│   ├── components/
│   │   ├── assumptions/
│   │   │   ├── ChoiceCard.svelte
│   │   │   ├── ChoiceGroup.svelte
│   │   │   ├── FastTrackForm.svelte
│   │   │   └── UserDrivenForm.svelte
│   │   │
│   │   ├── charts/
│   │   │   ├── receipt/
│   │   │   │   └── Receipt.svelte
│   │   │   ├── CumulativeSpendingChart.svelte
│   │   │   ├── EconomySpecificChart.svelte
│   │   │   ├── HistoricalSpendingChart.svelte
│   │   │   └── YearSpecificChart.svelte
│   │   │
│   │   ├── controls/
│   │   │   ├── Button.svelte
│   │   │   ├── Checkbox.svelte
│   │   │   └── Select.svelte
│   │   │
│   │   └── layout/
│   │       ├── AppHeader.svelte
│   │       ├── Credits.svelte
│   │       ├── Footer.svelte
│   │       └── PageShell.svelte
│   │
│   ├── data/
│   │   ├── calculateEstimate.js
│   │   └── loadData.js
│   │
│   ├── sharing/
│   │   ├── buildShareUrl.js
│   │   └── parseShareUrl.js
│   │
│   ├── stores/
│   │   └── calculatorState.js
│   │
│   └── utils/
│       ├── assumptionOptions.js
│       ├── formatters.js
│       └── spendingComponents.js
│
├── routes/
│   ├── fast-track/
│   │   └── +page.svelte
│   ├── share/
│   │   └── +page.svelte
│   ├── user-driven/
│   │   └── +page.svelte
│   ├── visualizer/
│   │   └── +page.svelte
│   ├── +layout.js
│   ├── +layout.svelte
│   └── +page.svelte
│
├── app.d.ts
└── app.html
```

Do not add abstractions preemptively. If implementation later shows that
a component or utility should be extracted, do it then.

---

## 1. Keep source data, user state, and calculated data separate

There are three distinct categories:

```
SOURCE DATA
Google Sheet
     │
     │
     ├──────────────┐
     ↓                │
ASSUMPTIONS           │
calculatorState       │
     │                │
     └──────┬───────┘
            ↓
   calculateEstimate()
            ↓
    RESOLVED ESTIMATE
            ↓
          charts
```

- **Source data** comes from the Google Sheet.
- **User/session state** lives in `calculatorState.js`.
- **Calculated data** is derived from those two inputs and is not
  stored as another piece of application state.

This prevents stale calculated data when assumptions change.

## 2. `loadData.js` and `calculateEstimate.js` have different jobs

### `loadData.js`

```text
Google Sheet
→ fetch
→ basic normalization
→ source dataset
```

It knows how to retrieve and normalize the published Google Sheet. It
does not care what the user selected.

### `calculateEstimate.js`

```js
calculateEstimate(data, assumptions);
```

It owns methodology and business rules. It receives the source data and
the current assumptions, chooses the appropriate spreadsheet columns,
and returns a resolved estimate.

Raw spreadsheet details such as:

```text
below_market_credit
below_market_credit_flow
below_market_credit_soe_vs_private
```

belong here. Chart components should never need to understand those
columns.

## 3. The resolved estimate remains long-form

The source spreadsheet already contains rows for:

```text
economy × year × unit
```

and contains all three supported units. MRI does not need to perform
unit conversions.

`calculateEstimate()` resolves the alternate methodology columns into
the 10 canonical spending components and calculates totals where
appropriate.

Conceptually, a resolved row looks like:

```js
{
  country: 'China',
  year: 2022,
  unit: 'pct_gdp',

  directSubsidies: ...,
  otherTaxIncentives: ...,
  rdTaxIncentives: ...,
  rdSupport: ...,
  belowMarketCredit: ...,
  stateInvestmentFunds: ...,
  governmentProcurement: ...,
  soeNetPayables: ...,
  land: ...,
  debtEquitySwaps: ...,

  total: ...
}
```

Equivalent rows exist for other units, years, and economies.

## 4. Charts own visualization math, not methodology math

Charts may:

- select/filter a unit
- select/filter a year
- select/filter an economy
- aggregate years for cumulative spending
- organize Highcharts series
- display component breakdowns
- calculate percentages for a 100% stack
- format labels and tooltips

Charts must not decide which methodology-specific spreadsheet column to
use. That belongs in `calculateEstimate.js`.

## 5. Calculate the estimate once for the Visualizer

Do not have each chart independently call `calculateEstimate()`.

```text
/visualizer
     ↓
calculateEstimate(data, assumptions)
     ↓
resolvedEstimate
 ┌───┼────┬────┐
 ↓   ↓    ↓    ↓
 H   C    Y    E
```

`/visualizer/+page.svelte` should calculate the current estimate once
and pass the same resolved dataset to all four charts.

If the user changes assumptions and returns to the Visualizer, the
estimate is calculated again from the new assumptions.

## 6. Receipt is separate from calculation

Receipt answers **"What did you choose?"** Charts answer **"What numbers
do those choices produce?"**

```text
calculatorState
     ├──→ Receipt → assumptions as human-readable text
     │
     └──→ calculateEstimate()
               ↓
             charts
```

`Receipt.svelte` uses assumptions and metadata, not the calculated
estimate.

Reuse labels from `assumptionOptions.js` and `spendingComponents.js`
rather than hard-coding a second set of translations inside Receipt.

## 7. `calculatorState.js` stores choices, not results

Conceptually:

```text
calculatorState
├── mode
├── fastTrackChoice
├── userDrivenChoices
│   ├── chinaEstimationApproach
│   ├── belowMarketCredit
│   ├── stateInvestmentFunds
│   ├── procurementCoverage
│   └── chinaOther
│
└── charts
    ├── historical
    │   └── unit
    │
    ├── cumulative
    │   ├── unit
    │   ├── showComponents
    │   └── scaleTo100
    │
    ├── yearSpecific
    │   ├── year
    │   ├── unit
    │   ├── showComponents
    │   └── scaleTo100
    │
    └── economySpecific
        ├── economy
        ├── unit
        ├── showComponents
        └── scaleTo100
```

Do not store:

- Google Sheet/source data
- calculated estimates
- chart series
- receipt strings
- formatted labels
- spreadsheet column names

## 8. Persist calculator state in `sessionStorage`

Refreshing should not wipe the user's work.

Persist user/session state in `sessionStorage`, not cookies or long-term
`localStorage`.

Use an initialization flag such as:

```js
initialized;
```

so routes can distinguish between "we haven't checked sessionStorage
yet" and "we checked and there is no active estimate."

Do not persist the Google Sheet dataset in sessionStorage.

## 9. Mode routes have semantic meaning

```text
/                neutral; does not create/change/reset an estimate
/fast-track      declares Fast Track mode
/user-driven     declares User Driven mode
/visualizer      requires an existing valid estimate
/share?...       reconstructs a shared estimate from the URL
```

Entering `/fast-track` while working in User Driven means the user
switched modes: clear the old estimate and start Fast Track.

Entering `/user-driven` while working in Fast Track does the reverse.

Entering the same active mode preserves existing answers.

Home is neutral and does not reset anything.

## 10. Browser Back and "Create a new estimate" mean different things

```text
Browser Back
= revise what I was doing

Create a new estimate
= throw this estimate away and start over
```

Browser Back preserves assumptions and chart display settings.

Every **Create a new estimate** action in the app should behave
consistently:

```text
reset calculatorState
→ clear persisted session state
→ navigate to /
```

No special cases and no confirmation modal are needed.

## 11. Forms enforce estimate completeness

Fast Track requires one choice:

```text
Minimum OR Maximum
```

User Driven requires all five user choices.

"Next: Visualizer" remains disabled until the appropriate form is
complete.

Define completeness once, conceptually with something like:

```js
isEstimateComplete(...)
```

so forms and route guards use the same rules.

## 12. `/visualizer` still guards against invalid direct navigation

Normal UI prevents incomplete estimates from reaching the Visualizer,
but users can manually enter URLs.

After calculator state has initialized:

```text
/visualizer
     ↓
complete estimate?
├── yes → render
└── no
    ├── no mode → /
    ├── incomplete Fast Track → /fast-track?incomplete=true
    └── incomplete User Driven → /user-driven?incomplete=true
```

The assumption form can then show a lightweight message such as:

> Complete your assumptions to view the Visualizer.

Never invent defaults for missing methodology choices.

## 13. Changing assumptions does not reset chart display settings

Example:

```text
Year: 2022
Unit: % GDP
Show components: on
```

If the user goes Back, changes Below-Market Credit from Stock to Flow,
and returns:

```text
new assumptions
      ↓
calculateEstimate()
      ↓
new resolved data
```

The chart still displays 2022, `% GDP`, and components.

**Estimate state and visualization state have separate lifecycles.**

## 14. The Visualizer intentionally has four chart components

Keep:

```text
HistoricalSpendingChart.svelte
CumulativeSpendingChart.svelte
YearSpecificChart.svelte
EconomySpecificChart.svelte
```

The program's older distinction between **Spending by Component** and
**Distribution of Spending** is represented in the current design as
chart display states (`showComponents` / `scaleTo100`) rather than
separate chart cards.

## 15. `showComponents` and `scaleTo100` are separate booleans

Valid states:

```text
components OFF + scale OFF
→ total spending

components ON + scale OFF
→ component values in selected unit

components ON + scale ON
→ component distribution totaling 100%
```

Invalid:

```text
components OFF + scale ON
```

Implementation rules:

- Disable **Scale to 100%** when **Show spending components** is off.
- If **Show spending components** is turned off while **Scale to 100%** is on, also set `scaleTo100` to false.
- The Unit control remains active in all chart states. When
  `scaleTo100` is enabled, component shares are calculated from the values for the currently selected unit.
- Each chart's display settings are independent.

## 16. Sharing does not use the active session as its source of truth

Every share URL contains everything required to reconstruct the shared
result:

```text
ALL ESTIMATE STATE
+
CHART TYPE
+
COMPLETE DISPLAY STATE FOR THAT CHART
```

User Driven share URLs always include all five assumptions because the
Share page includes the full Receipt.

Fast Track share URLs include the Minimum/Maximum choice.

## 17. Share URLs use compact query parameters

Do not add a server, database, share-ID service, or other persistence
layer.

The URL itself carries the state, using concise parameter names and
values to avoid unnecessarily large URLs.

Conceptually:

```text
/share?m=u&ca=s&bc=f&sf=10&pc=tg&o=i&c=y&y=22&u=g&co=1&s=0
```

This compact representation is only a transport format.

`buildShareUrl.js` converts descriptive application state into compact
URL values.

`parseShareUrl.js` converts those compact values back into descriptive
application state.

Do not allow compact codes such as `ca`, `bc`, or `tg` to leak into the
rest of the app.

No URL versioning is planned.

## 18. Shared results are frozen views

When the user clicks **Share chart**, capture:

- all estimate assumptions
- the selected chart type
- that chart's complete current display state

The Share page reconstructs the exact chart state plus Receipt.

```text
shared assumptions
        ↓
calculateEstimate()
        ↓
selected chart in exact shared state

+

shared assumptions
        ↓
Receipt
```

The Share page does not expose interactive chart controls.

The displayed chart can still be rendered with the existing Highcharts
component; a frozen share view does not inherently require generating a
PNG for page display.

## 19. Opening a Share URL does not replace the recipient's active session

Example:

```text
active estimate A
stored in sessionStorage

open /share?... representing estimate B

Share renders B from URL.
Estimate A remains untouched.
```

The Share page should pass parsed assumptions directly to
`calculateEstimate()` and `Receipt.svelte`, rather than writing the
shared assumptions into `calculatorState`.

If the recipient clicks **Create a new estimate**, the universal reset
rule applies: clear the active session and go Home.

## 20. Invalid share URLs display an error state

`parseShareUrl.js` validates the complete shared state.

Invalid examples include:

- missing required assumptions
- unknown compact values
- invalid chart type
- missing required chart-specific settings
- impossible chart-state combinations

Do not silently substitute defaults, because that could display a
legitimate-looking result that is not what the sender shared.

`/share/+page.svelte` should conditionally render either the shared
result or a friendly error state, e.g.:

> **This shared estimate can't be displayed.**\
> The link may be incomplete or invalid.\
> **Create a new estimate**

A separate error component is unnecessary unless implementation later
makes one useful.

---

## Overall Data and State Flow

```text
                    GOOGLE SHEET
                         │
                    loadData.js
                         │
                         ▼
                  source dataset
                         │
                         │
calculatorState ─────────┤
      │                  │
      │                  ▼
      │          calculateEstimate.js
      │                  │
      │                  ▼
      │          resolved estimate
      │                  │
      │          ┌───────┼───────┐
      │          ▼       ▼       ▼
      │        charts   charts   charts
      │
      ├───────────────→ Receipt
      │
      └───────────────→ buildShareUrl.js
                              │
                              ▼
                           /share
                              │
                       parseShareUrl.js
                         ┌────┴────┐
                         ▼         ▼
                 assumptions    chart state
                    │   │           │
                    │   └───────────┤
                    ▼               ▼
                 Receipt     selected chart
                    ▲               ▲
                    │               │
                    └─ calculate ────┘
```

## Guiding Implementation Principle

At this point the major architecture decisions are settled. During
implementation, prefer the simplest code that preserves these
responsibility boundaries.

Do not add components, stores, persistence layers, abstractions, or
error infrastructure merely because they might someday be useful.
Extract additional pieces only when actual implementation makes the need
clear.
