/**
 * Publishes every public package whose version is not on npm yet. Each one is packed with
 * `bun pm pack`, which turns `workspace:*` into the real version (npm publish would ship it as is),
 * and the tarball goes up with `npm publish` (provenance comes from NPM_CONFIG_PROVENANCE in CI).
 * Each published version gets its git tag and a "New tag:" line, which the Changesets action reads
 * to push the tags and write the GitHub releases.
 *
 * Usage: bun scripts/release.ts [--dry-run]
 */
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { $, Glob } from 'bun';

interface Manifest {
  name: string;
  version: string;
  private?: boolean;
}

const root = join(import.meta.dir, '..');
const dryRun = process.argv.includes('--dry-run');

async function publicPackages(): Promise<{ dir: string; manifest: Manifest }[]> {
  const found: { dir: string; manifest: Manifest }[] = [];
  for await (const file of new Glob('packages/*/package.json').scan(root)) {
    const manifest = (await Bun.file(join(root, file)).json()) as Manifest;
    if (!manifest.private) found.push({ dir: join(root, file, '..'), manifest });
  }
  return found.sort((a, b) => a.manifest.name.localeCompare(b.manifest.name));
}

async function onNpm({ name, version }: Manifest): Promise<boolean> {
  const result = await $`npm view ${`${name}@${version}`} version`.quiet().nothrow();
  return result.exitCode === 0 && result.stdout.toString().trim() === version;
}

async function publish(dir: string, manifest: Manifest, out: string): Promise<void> {
  const license = join(dir, 'LICENSE');
  const hadLicense = await Bun.file(license).exists();
  if (!hadLicense) await Bun.write(license, Bun.file(join(root, 'LICENSE')));
  try {
    await $`bun pm pack --destination ${out}`.cwd(dir).quiet();
  } finally {
    if (!hadLicense) await rm(license);
  }
  const tarball = [...new Glob('*.tgz').scanSync(out)].find((f) =>
    f.startsWith(manifest.name.replace('@', '').replace('/', '-')),
  );
  if (!tarball) throw new Error(`No tarball for ${manifest.name}`);
  const flags = dryRun ? ['--dry-run'] : [];
  await $`npm publish ${join(out, tarball)} --access public ${flags}`;
}

const out = await mkdtemp(join(tmpdir(), 'feitio-release-'));
let published = 0;
for (const { dir, manifest } of await publicPackages()) {
  const tag = `${manifest.name}@${manifest.version}`;
  if (await onNpm(manifest)) {
    console.log(`${tag} is already on npm`);
    continue;
  }
  await publish(dir, manifest, out);
  published += 1;
  if (dryRun) continue;
  await $`git tag ${tag}`.cwd(root).nothrow();
  console.log(`New tag: ${tag}`);
}
await rm(out, { recursive: true, force: true });
console.log(
  published
    ? `${published} package(s) ${dryRun ? 'would be ' : ''}published`
    : 'Nothing to publish',
);
