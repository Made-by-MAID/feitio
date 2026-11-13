/**
 * The declarations keep the source's import paths (./Nav.tsx); this points them at the built files
 * (./Nav.js), so a project using the package resolves its types.
 */
import { Glob } from 'bun';

const dist = new URL('../dist/', import.meta.url).pathname;
for await (const file of new Glob('**/*.d.ts').scan(dist)) {
  const path = `${dist}${file}`;
  const text = await Bun.file(path).text();
  await Bun.write(path, text.replace(/from '(\.{1,2}\/[^']+)\.tsx?'/g, "from '$1.js'"));
}
