<!--
  YearSpecificChart

  Spending visualization for a selected year.

  Responsibilities:
  - Render spending for the selected year from the resolved estimate.
  - Manage this chart's year, unit, and component display controls.
  - Support component and 100%-scaled views where applicable.
  - Configure the Highcharts visualization for this view.

  Implementation notes:
  - Receive resolved estimate data rather than raw source data.
  - This chart's display settings are independent from other charts.
  - Chart-specific filtering and presentation logic belongs here.
  - Do not resolve methodology-specific spreadsheet fields here.
-->