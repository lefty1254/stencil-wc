// // src/app/core/state/image-state.service.ts
// import { Injectable, resource, signal } from '@angular/core';
// import { OpenCvLoaderService } from '../opencv/opencv-loader';
// import { imshow } from '@techstark/opencv-js';

// type CanvasRenderer = (canvas: HTMLCanvasElement) => void;
// type RenderParams = { cv: any; src: ImageData | null };


// @Injectable({ providedIn: 'root' })
// export class ImageStateService {
//   private readonly _originalUrl  = signal<string | null>(null);
//   private readonly _originalData = signal<ImageData | null>(null);

//   readonly originalUrl  = this._originalUrl.asReadonly();
//   readonly originalData = this._originalData.asReadonly();

//   constructor(private readonly loader: OpenCvLoaderService) {}

//   /** Renderer for ORIGINAL image using cv.imshow (RGBA) */
//   readonly originalRendererRes = resource<CanvasRenderer | null, RenderParams>({
//     params: () => ({ cv: this.loader.api(), src: this._originalData() }),
//     loader: async ({ params }) => {
//       const { cv, src } = params;
//       if (!cv || !src) return null;

//       // Return a closure that draws when you give it a <canvas>
//       return (canvas: HTMLCanvasElement) => {
//         const mat = cv.matFromImageData(src); // 4-ch
//         try {
//           canvas.width = src.width;
//           canvas.height = src.height;
//           cv.imshow(canvas, mat);
//         } finally {
//           mat.delete();
//         }
//       };
//     },
//   });

//   /** Renderer for GRAYSCALE (compute gray -> RGBA, then imshow) */
//   // readonly grayRendererRes = resource<CanvasRenderer | null>({
//   //   params: () => ({ cv: this.loader.api(), src: this._originalData() }),
//   //   loader: ({ params }) => {
//   //     const { cv, src } = params;
//   //     if (!cv || !src) return null;

//   //     // Precompute nothing; do work in the closure, clean up immediately
//   //     return (canvas: HTMLCanvasElement) => {
//   //       const srcMat  = cv.matFromImageData(src); // 4-ch
//   //       const gray    = new cv.Mat();
//   //       const grayRgba= new cv.Mat();
//   //       try {
//   //         cv.cvtColor(srcMat, gray, cv.COLOR_RGBA2GRAY);   // 1-ch
//   //         cv.cvtColor(gray, grayRgba, cv.COLOR_GRAY2RGBA); // 4-ch
//   //         canvas.width  = src.width;
//   //         canvas.height = src.height;
//   //         cv.imshow(canvas, grayRgba);
//   //       } finally {
//   //         srcMat.delete(); gray.delete(); grayRgba.delete();
//   //       }
//   //     };
//   //   },
//   // });

//   /** Set uploaded image */
//   setOriginal(url: string, data: ImageData) {
//     const old = this._originalUrl();
//     if (old && old.startsWith('blob:')) URL.revokeObjectURL(old);
//     this._originalUrl.set(url);
//     this._originalData.set(data);
//   }

//   clear() {
//     const old = this._originalUrl();
//     if (old && old.startsWith('blob:')) URL.revokeObjectURL(old);
//     this._originalUrl.set(null);
//     this._originalData.set(null);
//   }
// }
// src/app/core/state/image-state.service.ts
import { Injectable, computed, resource, signal, inject } from '@angular/core';
import { EDGE_API } from '../opencv/edge.token';
import type { EdgeApi } from '../opencv/edge.types';

@Injectable({ providedIn: 'root' })
export class ImageStateService {
  private readonly api = inject<EdgeApi>(EDGE_API);

  // original pixels
  private readonly _src = signal<ImageData | null>(null);
  readonly src = this._src.asReadonly();

  // size for aspect ratio
  readonly size = computed(() => {
    const s = this._src(); return s ? { w: s.width, h: s.height } : null;
  });

  // grayscale (async)
  readonly grayRes = resource<ImageData | null, ImageData | null>({
    params: (): ImageData | null => this._src(),
    loader: async ({ params }) => params ? await this.api.makeGray(params) : null,
  });

  async setSource(img: ImageData) {
    this._src.set(img);
  }

  clear() {
    this._src.set(null);
  }
  async loadFile(file: File): Promise<void> {
    const url = URL.createObjectURL(file);
    const img = new Image();

    return new Promise((resolve, reject) => {
      img.onload = async () => {
        try {
          const w = img.naturalWidth;
          const h = img.naturalHeight;

          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;

          const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
          ctx.drawImage(img, 0, 0);

          const data = ctx.getImageData(0, 0, w, h);
          await this.setSource(data);
          resolve();
        } catch (err) {
          reject(err);
        } finally {
          URL.revokeObjectURL(url);
        }
      };
      img.onerror = reject;
      img.src = url;
    });
  }
}
