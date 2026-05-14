# URL checker

A small React app that validates URL strings in the browser and simulates a server lookup to see whether a normalized URL is “known” (mock data only).

## Features

- **Client-side validation** — Checks format and hostname rules (including optional `http`/`https`, and `www` handling).
- **Mock availability check** — After a short debounce, runs a fake request that returns “exists” / “does not exist” and a type for a few hardcoded URLs.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (comes with Node)

## Setup

```bash
npm install
```

## Running the app

```bash
npm start
```

Then open <http://localhost:3000>. Type a URL into the input field. The format is validated as you type; if it is valid, the app waits briefly for you to finish typing and then performs a (mocked) existence check. A few hardcoded URLs return "exists" — for example `www.example.com`, `news.ycombinator.com`, `google.com/file.txt`. Anything else returns "Does not exist".

## Scripts

| Command | Description |
|--------|-------------|
| `npm start` | Dev server at [http://localhost:3000](http://localhost:3000) |
| `npm test` | Run tests (interactive) |
| `npm run build` | Production build in `build/` |

To run the tests once and exit (CI mode):

```bash
CI=true npm test
```

## Stack

- React 19
- Create React App (`react-scripts` 5)

## License

Private project (`package.json` sets `"private": true`).