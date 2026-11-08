import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { IconSource } from '../calculations/render-sprite.ts';

/** Every `<name>.svg` of the icons folder, except the generated sprite. */
export async function loadIcons(folder: string): Promise<IconSource[]> {
  const files = (await readdir(folder)).filter(
    (file) => file.endsWith('.svg') && file !== 'sprite.svg',
  );
  return Promise.all(
    files.map(async (file) => ({
      name: file.replace(/\.svg$/, ''),
      svg: await readFile(join(folder, file), 'utf8'),
    })),
  );
}
