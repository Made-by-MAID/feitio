import { expect, test } from 'bun:test';
import { join } from 'node:path';
import { readTextFile } from '../tokens/actions/read-text-file.ts';
import { buildOutputs } from './build-tokens.ts';

test('the committed css/ and js/ match the tokens: run `bun run build` after changing them', async () => {
  const outputs = await buildOutputs(join(import.meta.dir, '..', '..'));
  for (const [path, text] of outputs) {
    expect({ path, text: await readTextFile(path) }).toEqual({ path, text });
  }
});
