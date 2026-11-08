import { readFile } from 'node:fs/promises';

/** Reads and parses a JSON file. */
export async function readJsonFile(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, 'utf8'));
}
