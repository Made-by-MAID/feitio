# Changesets

Every pull request that changes a published package (`@feitio/*`) adds a changeset: run
`bun run changeset`, pick the bump and write one line for the changelog. All packages share one
version (the `fixed` group in `config.json`): Feitio 1.2 is the same in CSS, vanilla and every port.
