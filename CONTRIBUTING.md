# Contributing to Feitio

Thank you for wanting to help. Feitio is small on purpose: few components, each one finished well,
so the best contributions are often fixes, clearer words and better tests.

## Before you start

- Read [`AGENTS.md`](AGENTS.md): the rules for anyone changing the repository, people and AI agents
  alike (never write a value outside the tokens, never write a component's HTML twice, and so on).
- Read the [guidelines](https://made-by-maid.github.io/feitio/) for anything visual.
- For a new component or a bigger change, open an issue first and say what it is for and when it
  should not be used.

## Working on it

With [Bun](https://bun.sh):

```sh
bun install
bun run build       # tokens and icons
bun run check       # style, types and unit tests
bun run test:docs   # the docs site in a real browser, plus the React parity tests
```

The browser tests need Chromium: `bunx playwright install chromium`.

## A pull request

- One subject per pull request, with tests for what it changes.
- A change to a published package (`packages/*`) adds a changeset: `bun run changeset`.
- Docs pages exist in five languages (PT, EN, ES, FR, DE): new words go in all five.
- Code, comments and commit messages in English.

## Conduct and security

Everyone taking part follows the [Code of Conduct](CODE_OF_CONDUCT.md). To report a vulnerability,
see [SECURITY.md](SECURITY.md); never in a public issue.
