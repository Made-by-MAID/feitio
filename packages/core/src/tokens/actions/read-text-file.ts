import { readFile } from 'node:fs/promises';

/** Reads a text file, or gives null when it does not exist. */
export async function readTextFile(path: string): Promise<string | null> {
  try {
    return await readFile(path, 'utf8');
  } catch {
    return null;
  }
}
