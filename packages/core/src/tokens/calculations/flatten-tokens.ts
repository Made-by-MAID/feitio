import type { FlatToken, Token, TokenGroup, TokenType } from '../data/token.ts';

function isToken(node: unknown): node is Token {
  return typeof node === 'object' && node !== null && '$value' in node;
}

function isGroup(node: unknown): node is TokenGroup {
  return typeof node === 'object' && node !== null && !isToken(node);
}

function walk(group: TokenGroup, path: readonly string[], inherited?: TokenType): FlatToken[] {
  const groupType = group.$type ?? inherited;
  return Object.entries(group).flatMap(([key, node]) => {
    if (key.startsWith('$')) return [];
    const here = [...path, key];
    if (isToken(node)) {
      const type = node.$type ?? groupType;
      if (type === undefined) throw new Error(`${here.join('.')} has no $type`);
      return [{ path: here, type, value: node.$value }];
    }
    return isGroup(node) ? walk(node, here, groupType) : [];
  });
}

/** Every token of a tree in document order, each with the type it gets from itself or its groups. */
export function flattenTokens(tree: TokenGroup): FlatToken[] {
  return walk(tree, []);
}
