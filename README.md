# More Red Ink

Interactive tool for exploring estimates of China's industrial policy spending.

## Development

This project uses SvelteKit and Svelte 5.

### Requirements

- Node.js 20
- npm

### Getting started

Clone the repository and install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

### Before opening a pull request

Run the following checks locally:

```bash
npm run check
npm run lint
npm run build
```

All three should pass before opening a pull request.

### Branch workflow

Development should happen on feature branches rather than directly on `main`.

Create a branch from an up-to-date `main`:

```bash
git checkout main
git pull
git checkout -b <branch-name>
```

Push the branch to GitHub and open a pull request into `main`.

The `main` branch is deployed to Netlify.

## Project architecture

The application keeps three types of data separate:

1. **Source data** — loaded and normalized by `src/lib/data/loadData.js`
2. **Calculator state** — the user's assumptions and chart settings
3. **Calculated data** — resolved by `src/lib/data/calculateEstimate.js`

Components should consume shared calculator state and resolved estimate data rather than interpreting raw spreadsheet fields themselves.

The application uses Svelte 5 runes. New Svelte code should use current Svelte 5 patterns rather than legacy Svelte APIs.

See `architecture-notes.md` for detailed application architecture and implementation decisions.