# Security

## Reporting a vulnerability

Please do **not** open a public issue. Report it privately through GitHub: on the
[Security tab](https://github.com/Made-by-MAID/feitio/security) of this repository, choose
**Report a vulnerability**. You will get an answer as soon as possible, and credit when it is fixed,
if you want it.

## Supported versions

Feitio is young: only the latest published version of each package (`@feitio/core`,
`@feitio/vanilla`, `@feitio/astro`, `@feitio/react`) receives fixes.

## What Feitio does

The packages are CSS, static assets and small client-side behaviors. They make no network requests,
collect no data and store nothing but the day or night choice the docs site keeps in
`localStorage`. Every release is published from GitHub Actions with npm provenance.
