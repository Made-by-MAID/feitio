/** A box on the screen, in px. */
export type Box = { left: number; top: number; right: number; bottom: number };
/** The inner radii of a border, [horizontal, vertical] per corner, in px. */
export type Corners = {
  topLeft: [number, number];
  topRight: [number, number];
  bottomRight: [number, number];
  bottomLeft: [number, number];
};

/**
 * How far, in px, the ink of a text goes past the inside edge of a border with rounded corners; 0
 * when it stays inside. The ink is a box, so the check is on the safe side: a corner of that box
 * must also be inside the curve of the border's corner. The distance past a curve is measured along
 * its radius and scaled by the smaller radius, which is exact for a circle and close for an ellipse.
 * Self-contained (it is also sent to the browser as text).
 */
export function inkPastBorder(ink: Box, inner: Box, corners: Corners): number {
  const sides = Math.max(
    inner.left - ink.left,
    ink.right - inner.right,
    inner.top - ink.top,
    ink.bottom - inner.bottom,
    0,
  );
  const points: [number, number, [number, number], number, number][] = [
    [ink.left, ink.top, corners.topLeft, 1, 1],
    [ink.right, ink.top, corners.topRight, -1, 1],
    [ink.right, ink.bottom, corners.bottomRight, -1, -1],
    [ink.left, ink.bottom, corners.bottomLeft, 1, -1],
  ];
  let curves = 0;
  for (const [x, y, [rx, ry], towardX, towardY] of points) {
    if (rx <= 0 || ry <= 0) continue;
    const centerX = (towardX > 0 ? inner.left : inner.right) + towardX * rx;
    const centerY = (towardY > 0 ? inner.top : inner.bottom) + towardY * ry;
    const inCornerX = towardX > 0 ? x < centerX : x > centerX;
    const inCornerY = towardY > 0 ? y < centerY : y > centerY;
    if (!inCornerX || !inCornerY) continue;
    const reach = Math.hypot((x - centerX) / rx, (y - centerY) / ry);
    curves = Math.max(curves, (reach - 1) * Math.min(rx, ry));
  }
  return Math.max(sides, curves);
}
