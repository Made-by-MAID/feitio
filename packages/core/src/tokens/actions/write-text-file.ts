import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

/** Writes a text file, creating its folder when needed. */
export async function writeTextFile(path: string, text: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, text);
}
