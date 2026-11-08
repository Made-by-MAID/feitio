import { join } from 'node:path';
import { loadIcons } from '../icons/actions/load-icons.ts';
import { renderSprite } from '../icons/calculations/render-sprite.ts';
import { loadTokens } from '../tokens/actions/load-tokens.ts';
import { readTextFile } from '../tokens/actions/read-text-file.ts';
import { writeTextFile } from '../tokens/actions/write-text-file.ts';
import { renderCss } from '../tokens/calculations/render-css.ts';
import { renderTypescript } from '../tokens/calculations/render-typescript.ts';

/** The theme a page gets when it sets no `data-theme`. */
export const DEFAULT_THEME = 'casa';

/** What `bun run build` writes, from the tokens and icons folders of the repository root. */
export async function buildOutputs(root: string): Promise<Map<string, string>> {
  const { base, themes } = await loadTokens(join(root, 'tokens'));
  const icons = await loadIcons(join(root, 'icons'));
  return new Map([
    [join(root, 'icons', 'sprite.svg'), renderSprite(icons)],
    [join(root, 'css', 'tokens.css'), renderCss(base, themes, DEFAULT_THEME)],
    [
      join(root, 'js', 'tokens.ts'),
      renderTypescript(
        base,
        themes.map((theme) => theme.tokens),
      ),
    ],
  ]);
}

/** Writes the outputs, or with `--check` only says whether the committed ones are up to date. */
async function main(root: string, check: boolean): Promise<number> {
  const outputs = await buildOutputs(root);
  const stale: string[] = [];
  for (const [path, text] of outputs) {
    if (check) {
      if ((await readTextFile(path)) !== text) stale.push(path);
    } else {
      await writeTextFile(path, text);
    }
  }
  if (stale.length > 0) {
    console.error(`Out of date, run \`bun run build\`: ${stale.join(', ')}`);
    return 1;
  }
  console.log(
    check ? 'Generated files are up to date.' : `Wrote ${[...outputs.keys()].join(', ')}`,
  );
  return 0;
}

if (import.meta.main) {
  process.exit(await main(join(import.meta.dir, '..', '..'), process.argv.includes('--check')));
}
