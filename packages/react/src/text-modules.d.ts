/** Files imported as text (with { type: 'text' }), like the illustrations. */
declare module '*.svg' {
  const text: string;
  export default text;
}
