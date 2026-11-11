/** A color in OKLCH: lightness from 0 to 1, chroma from 0 (gray) up, hue in degrees. */
export type Oklch = { readonly l: number; readonly c: number; readonly h: number };

/** Linear-light sRGB channels, each from 0 to 1 when the color is inside the sRGB gamut. */
export type LinearRgb = { readonly r: number; readonly g: number; readonly b: number };
