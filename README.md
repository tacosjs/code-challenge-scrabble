# Scrabble Coding Challenge - Hasbro

## Getting Started

**Prerequisite:** [Node.js 18+](https://nodejs.org/en)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000/](http://localhost:3000/) in your browser.

The dev server runs with hot reload—changes to the code will auto-refresh in the browser.

## Running Tests

The project uses [Vitest](https://vitest.dev/). Run the full test suite with:

```bash
npm test
```

Tests cover word finding from a rack, scoring, and validation (e.g. tile limits, 7-letter rack constraint), based on the examples provided in the document.

## Technical Notes

### Dictionary

The English dictionary uses the official [Collins Scrabble Words (2019)](https://en.wikipedia.org/wiki/Collins_Scrabble_Words), the word authority for tournament Scrabble in the USA and Canada.

### Score Calculation

The scoring system is based on the [English letter distribution](https://en.wikipedia.org/wiki/Scrabble_letter_distributions) from Wikipedia.
