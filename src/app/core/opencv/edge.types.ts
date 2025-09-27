// // core/opencv/edge.types.ts
// export type RGBA = [number, number, number, number];

// export type EdgeAlgoId = 'canny' | 'sobel' | 'laplacian';

// export type EdgeMask = { data: Uint8Array; width: number; height: number };

// export type CannyParams     = { low: number; high: number; thickness?: number };
// export type SobelParams     = { ksize?: number; scale?: number; delta?: number; thickness?: number };
// export type LaplacianParams = { ksize?: number; scale?: number; delta?: number; thickness?: number };

// export type EdgeParamsMap = {
//   canny: CannyParams;
//   sobel: SobelParams;
//   laplacian: LaplacianParams;
// };
// export type EdgeParams<A extends EdgeAlgoId> = EdgeParamsMap[A];

// export interface EdgeApi {
//   /** Load/replace the session source. Also sets gray in the impl. */
//   setSource(srcRgba: ImageData): Promise<void>;

//   /** Signals for UI (never expose cv.Mat). */
//   readonly srcRgba: () => ImageData | null;
//   readonly grayRgba: () => ImageData | null;
//   readonly size: () => { w: number; h: number } | null;

//   /** Edge computation uses the already-held gray (impl decides how). */
//   computeEdgeMask<A extends EdgeAlgoId>(algo: A, params: EdgeParams<A>): Promise<EdgeMask>;

//   /** Colorize a mask to RGBA overlay (pure, same both impls). */
//   colorizeMask(mask: EdgeMask, color: RGBA): ImageData;

//   /** Clear mats / server handles etc. */
//   dispose(): void;
// }

// src/app/core/opencv/edge.types.ts
export type RGBA = [number, number, number, number];
export interface EdgeApi {
  makeGray(src: ImageData): Promise<ImageData>;
}
