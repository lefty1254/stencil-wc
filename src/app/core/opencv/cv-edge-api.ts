// // core/opencv/cv-edge-api.service.ts
// import { Injectable, resource, signal, computed } from '@angular/core';
// import cvReady from '@techstark/opencv-js';
// import { EDGE_API } from './edge.token';
// import { EdgeApi, EdgeAlgoId, EdgeParamsMap, EdgeMask, RGBA, EdgeParams, CannyParams, SobelParams, LaplacianParams } from './edge.types';


// @Injectable({ providedIn: 'root'})
// export class CvEdgeApi implements EdgeApi {
//   // cv init
//   private readonly cvRes = resource({ loader: async () => await cvReady });
//   private cv() { const v = this.cvRes.value(); if (!v) throw new Error('OpenCV not ready'); return v; }
//   buildInfo = computed(() => {
//     const cv = this.cvRes.value();
//     return cv ? cv.getBuildInformation() : 'OpenCV not ready';
//   });

//   // UI-facing signals
//   private readonly _srcRgba = signal<ImageData | null>(null);
//   private readonly _grayRgba = signal<ImageData | null>(null);

//   readonly srcRgba = this._srcRgba.asReadonly();
//   readonly grayRgba = this._grayRgba.asReadonly();
//   readonly size = computed(() => {
//     const s = this._srcRgba(); return s ? { w: s.width, h: s.height } : null;
//   });

//   // private mats (not exposed)
//   private srcMat: any | null = null;
//   private grayMat: any | null = null;

//   async setSource(srcRgba: ImageData): Promise<void> {
//     // ensure cv
//     const cv = this.cv();

//     // cleanup old mats
//     this.disposeMats();

//     // store UI copy
//     this._srcRgba.set(srcRgba);

//     // build mats + gray once
//     const src = cv.matFromImageData(srcRgba);
//     const gray = new cv.Mat();
//     try {
//       const tmpGray = new cv.Mat();
//       cv.cvtColor(src, tmpGray, cv.COLOR_RGBA2GRAY);
//       // keep a 4ch gray for UI
//       const gray4 = new cv.Mat();
//       cv.cvtColor(tmpGray, gray4, cv.COLOR_GRAY2RGBA);

//       // publish UI gray
//       this._grayRgba.set(new ImageData(new Uint8ClampedArray(gray4.data), gray4.cols, gray4.rows));

//       // keep 1ch gray for algorithms
//       gray.create(tmpGray.rows, tmpGray.cols, cv.CV_8U);
//       tmpGray.copyTo(gray);

//       // retain mats
//       this.srcMat = src;
//       this.grayMat = gray;

//       // cleanup temps
//       tmpGray.delete(); gray4.delete();
//     } catch (e) {
//       src.delete(); gray.delete?.();
//       this._srcRgba.set(null); this._grayRgba.set(null);
//       throw e;
//     }
//   }

//   async computeEdgeMask<A extends EdgeAlgoId>(algo: A, p: EdgeParamsMap[A]): Promise<EdgeMask> {
//     const cv = this.cv();
//     if (!this.grayMat) throw new Error('No source loaded');

//     const edges = new cv.Mat();
//     try {
//       switch (algo) {
//         case 'canny': await this.canny(edges, p as CannyParams); break;
//         case 'sobel': await this.sobel(edges, p as SobelParams); break;
//         case 'laplacian': await this.laplacian(edges, p as LaplacianParams); break;
//         default: throw new Error(`Unknown edge algo ${algo}`);
//       }
//       return { data: new Uint8Array(edges.data), width: edges.cols, height: edges.rows };
//     } finally {
//       edges.delete?.();
//     }
//   }
//   async canny(edges: cvReady.Mat, p: CannyParams) {
//     const cv = this.cv();
//     const { low, high, thickness = 1 } = p;
//     cv.Canny(this.grayMat, edges, low, high);
//     if (thickness > 1) this.dilateInPlace(cv, edges, thickness);
//   }
//   async sobel(edges: cvReady.Mat, p: SobelParams) {
//     const cv = this.cv();
//     const { ksize = 3, scale = 1, delta = 0, thickness = 1 } = p;

//     const gx = new cv.Mat(), gy = new cv.Mat();
//     try {
//       cv.Sobel(this.grayMat, gx, cv.CV_32F, 1, 0, ksize, scale, delta, cv.BORDER_DEFAULT);
//       cv.Sobel(this.grayMat, gy, cv.CV_32F, 0, 1, ksize, scale, delta, cv.BORDER_DEFAULT);

//       if ((cv as any).magnitude) {
//         const mag32 = new cv.Mat();
//         try {
//           (cv as any).magnitude(gx, gy, mag32);
//           cv.normalize(mag32, mag32, 0, 255, cv.NORM_MINMAX);
//           cv.convertScaleAbs(mag32, edges);
//         } finally { mag32.delete(); }
//       } else if ((cv as any).cartToPolar) {
//         const mag32 = new cv.Mat(), ang = new cv.Mat();
//         try {
//           (cv as any).cartToPolar(gx, gy, mag32, ang, true);
//           cv.normalize(mag32, mag32, 0, 255, cv.NORM_MINMAX);
//           cv.convertScaleAbs(mag32, edges);
//         } finally { mag32.delete(); ang.delete(); }
//       } else {
//         // ✅ Proper fallback: |gx| + |gy|
//         const ax = new cv.Mat(), ay = new cv.Mat();
//         try {
//           cv.convertScaleAbs(gx, ax); // absolute gx
//           cv.convertScaleAbs(gy, ay); // absolute gy
//           cv.addWeighted(ax, 0.5, ay, 0.5, 0, edges);
//         } finally { ax.delete(); ay.delete(); }
//       }

//       cv.threshold(edges, edges, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);
//       if (thickness > 1) this.dilateInPlace(cv, edges, thickness);
//     } finally {
//       gx.delete(); gy.delete();
//     }
//   }
//   async laplacian(edges: cvReady.Mat, p: LaplacianParams) {
//     const cv = this.cv();
//     const { ksize = 3, scale = 1, delta = 0, thickness = 1 } = p;
//     const lap = new cv.Mat();
//     cv.Laplacian(this.grayMat, lap, cv.CV_16S, ksize, scale, delta, cv.BORDER_DEFAULT);
//     cv.convertScaleAbs(lap, edges);
//     cv.threshold(edges, edges, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);
//     lap.delete();
//     if (thickness > 1) this.dilateInPlace(cv, edges, thickness);
//   }


//   colorizeMask(mask: EdgeMask, [r, g, b, a]: RGBA): ImageData {
//     const { data, width, height } = mask;
//     const out = new Uint8ClampedArray(width * height * 4);
//     for (let i = 0, j = 0; i < data.length; i++, j += 4) {
//       if (data[i]) { out[j] = r; out[j + 1] = g; out[j + 2] = b; out[j + 3] = a; }
//       else out[j + 3] = 0;
//     }
//     return new ImageData(out, width, height);
//   }

//   dispose(): void {
//     this.disposeMats();
//     this._srcRgba.set(null);
//     this._grayRgba.set(null);
//   }

//   private disposeMats() {
//     this.srcMat?.delete?.(); this.srcMat = null;
//     this.grayMat?.delete?.(); this.grayMat = null;
//   }

//   private dilateInPlace(cv: any, mat: any, k: number) {
//     const kernel = cv.Mat.ones(k, k, cv.CV_8U);
//     const out = new cv.Mat();
//     cv.dilate(mat, out, kernel);
//     mat.delete(); kernel.delete();
//     (mat as any) = out;
//   }
// }
// src/app/core/opencv/cv-edge-api.service.ts
import { Injectable, resource } from '@angular/core';
import cvReady from '@techstark/opencv-js';
import type { EdgeApi } from './edge.types';

type CV = Awaited<typeof cvReady>;

@Injectable({ providedIn: 'root' })
export class CvEdgeApi implements EdgeApi {
  private readonly cvRes = resource({ loader: async () => await cvReady });
  private cv(): CV {
    const v = this.cvRes.value();
    if (!v) throw new Error('OpenCV not ready');
    return v;
  }

  async makeGray(src: ImageData): Promise<ImageData> {
    const cv = this.cv();
    const srcMat = cv.matFromImageData(src);
    const gray = new cv.Mat();
    const out4 = new cv.Mat();
    try {
      cv.cvtColor(srcMat, gray, cv.COLOR_RGBA2GRAY);
      cv.cvtColor(gray, out4, cv.COLOR_GRAY2RGBA);
      return new ImageData(new Uint8ClampedArray(out4.data), out4.cols, out4.rows);
    } finally {
      srcMat.delete(); gray.delete(); out4.delete();
    }
  }
}
