// src/app/shared/display-utils.ts
export type Size = { w: number; h: number };

/** Fit `seed` into a display box constrained by maxW/maxH, keep aspect ratio.
 * Also clamp to a minimum so images are never too tiny.
 */
export function fitBox(seed: Size, maxW: number, maxH: number, minW = 320, minH = 240): Size {
  const ar = seed.w / seed.h;
  // desired box within max bounds
  let w = Math.min(maxW, Math.max(minW, Math.floor(maxH * ar)));
  let h = Math.floor(w / ar);
  if (h > maxH) { h = maxH; w = Math.floor(h * ar); }
  // enforce minimums
  if (w < minW) { w = minW; h = Math.floor(w / ar); }
  if (h < minH) { h = minH; w = Math.floor(h * ar); }
  return { w, h };
}
