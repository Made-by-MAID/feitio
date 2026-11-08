/**
 * The Design Tokens Community Group format (2025.10), as much of it as Feitio uses. A token has
 * a `$value`; anything else with keys is a group. `$type` set on a group holds for what it holds.
 */
export type TokenType =
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'number'
  | 'duration'
  | 'cubicBezier'
  | 'shadow';

export type Dimension = { readonly value: number; readonly unit: 'px' | 'rem' | 'ms' };

export type ColorValue = {
  readonly colorSpace: 'oklch';
  readonly components: readonly [number, number, number];
  readonly alpha?: number;
};

export type ShadowValue = {
  readonly color: ColorValue | string;
  readonly offsetX: Dimension;
  readonly offsetY: Dimension;
  readonly blur: Dimension;
  readonly spread: Dimension;
};

export type TokenValue =
  | ColorValue
  | Dimension
  | ShadowValue
  | readonly string[]
  | readonly number[]
  | number
  | string;

export type Token = {
  readonly $value: TokenValue;
  readonly $type?: TokenType;
  readonly $description?: string;
};

export type TokenGroup = {
  readonly $type?: TokenType;
  readonly $description?: string;
  readonly [key: string]: TokenGroup | Token | TokenType | string | undefined;
};

/** A token taken out of its tree: where it was, its type (its own or its group's) and value. */
export type FlatToken = {
  readonly path: readonly string[];
  readonly type: TokenType;
  readonly value: TokenValue;
};

/** A theme: a name, whether it is the day or night version, and its tokens. */
export type Theme = {
  readonly name: string;
  readonly mode: 'light' | 'dark';
  readonly tokens: TokenGroup;
};
