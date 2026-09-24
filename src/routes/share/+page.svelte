<!--
  Share

  Reconstructs and displays a shared estimate.

  Responsibilities:
  - Read and validate the shared calculator configuration from the URL.
  - Reconstruct the corresponding estimate.
  - Display the shared receipt and visualization.
  - Allow the user to copy the share link or start a new estimate.

  Implementation notes:
  - Use parseShareUrl.js for URL parsing and validation.
  - Recalculate the estimate from the shared assumptions and source data.
  - Do not encode or trust calculated results from the URL.
-->
