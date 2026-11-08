import type { ColorValue, Dimension, ShadowValue, TokenType, TokenValue } from '../data/token.ts';
import { cssVariableName } from './css-variable-name.ts';

const GENERIC_FAMILIES = new Set([
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
]);
const REFERENCE = /^\{([^}]+)\}$/;

function reference(text: string): string {
  const match = REFERENCE.exec(text);
  if (match?.[1] === undefined) throw new Error(`"${text}" is not a reference`);
  return `var(${cssVariableName(match[1].split('.'))})`;
}

function color({ components: [l, c, h], alpha }: ColorValue): string {
  const base = `${+(l * 100).toFixed(2)}% ${c} ${h}`;
  return alpha === undefined ? `oklch(${base})` : `oklch(${base} / ${alpha})`;
}

function dimension({ value, unit }: Dimension): string {
  return `${value}${unit}`;
}

function family(names: readonly string[]): string {
  return names.map((name) => (GENERIC_FAMILIES.has(name) ? name : `"${name}"`)).join(', ');
}

function shadow({ color: ink, offsetX, offsetY, blur, spread }: ShadowValue): string {
  const inkCss = typeof ink === 'string' ? reference(ink) : color(ink);
  return [offsetX, offsetY, blur, spread].map(dimension).concat(inkCss).join(' ');
}

function mismatch(type: TokenType, value: TokenValue): never {
  throw new Error(`a ${type} token cannot hold ${JSON.stringify(value)}`);
}

/** How a token's value is written in CSS. A `{path}` reference becomes `var(--feitio-path)`. */
export function formatCssValue(type: TokenType, value: TokenValue): string {
  if (typeof value === 'string') return reference(value);
  switch (type) {
    case 'color':
      return typeof value === 'object' && 'colorSpace' in value
        ? color(value)
        : mismatch(type, value);
    case 'dimension':
    case 'duration':
      return typeof value === 'object' && 'unit' in value
        ? dimension(value)
        : mismatch(type, value);
    case 'fontFamily':
      return Array.isArray(value) ? family(value as readonly string[]) : mismatch(type, value);
    case 'fontWeight':
    case 'number':
      return typeof value === 'number' ? String(value) : mismatch(type, value);
    case 'cubicBezier':
      return Array.isArray(value) ? `cubic-bezier(${value.join(', ')})` : mismatch(type, value);
    case 'shadow':
      return typeof value === 'object' && 'offsetX' in value
        ? shadow(value)
        : mismatch(type, value);
  }
}
