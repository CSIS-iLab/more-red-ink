<!--
  Visualizer

  Displays the estimate produced by the user's calculator choices.

  Responsibilities:
  - Require a valid active estimate configuration.
  - Resolve the estimate from source data and the current assumptions.
  - Render the receipt and all four chart views.
  - Provide access to sharing functionality.

  Implementation notes:
  - Call calculateEstimate() once for the current assumptions.
  - Pass the same resolved estimate to each chart component.
  - Do not have individual charts independently calculate the estimate.
-->