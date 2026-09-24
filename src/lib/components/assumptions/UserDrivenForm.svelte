<!--
  UserDrivenForm

  Form for building a custom set of estimation assumptions.

  Responsibilities:
  - Present the configurable methodology choices.
  - Update calculator state as the user makes selections.
  - Allow the user to continue once the required choices are valid.

  Implementation notes:
  - Reuse option metadata from assumptionOptions.js.
  - Store user choices in calculatorState.js.
  - Do not translate choices into spreadsheet columns here.
  - Do not calculate the estimate here; methodology resolution belongs
    in calculateEstimate.js.
-->
