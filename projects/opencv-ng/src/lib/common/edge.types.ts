export type RGBA = [number, number, number, number];

export interface EdgeMask { data: Uint8Array; width: number; height: number; }

export interface CannyParams     { low: number; high: number; thickness?: number; }
export interface SobelParams     { ksize?: number; scale?: number; delta?: number; thickness?: number; }
export interface LaplacianParams { ksize?: number; scale?: number; delta?: number; thickness?: number; }

export const enum EdgeAlgoId { Canny='canny', Sobel='sobel', Laplacian='laplacian' }

export interface EdgeParamsMap {
  [EdgeAlgoId.Canny]: CannyParams;
  [EdgeAlgoId.Sobel]: SobelParams;
  [EdgeAlgoId.Laplacian]: LaplacianParams;
}

/** What the app consumes (browser or http impls conform to this) */
export interface EdgeApi {
  setSource(srcRgba: ImageData): Promise<void>;
  makeGray(src: ImageData): Promise<ImageData>;
  computeEdgeMask<A extends EdgeAlgoId>(algo: A, params: EdgeParamsMap[A]): Promise<EdgeMask>;
  dispose(): void;
}
