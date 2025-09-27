// import { Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';
// import { OpenCvLoaderService } from '../../../core/opencv/opencv-loader';
// import { ImageStateService } from '../../../core/state/image-state';
// import { FormsModule } from '@angular/forms';
// @Component({
//   selector: 'algo-canny',
//   imports: [FormsModule],
//   templateUrl: './canny.html',
//   styleUrl: './canny.scss'
// })
// export class Canny {
//   // Inputs as signal inputs
//   readonly low = signal<number>(100);
//   readonly high = signal<number>(200);


//   // Inject services
//   private readonly cvLoader = inject(OpenCvLoaderService);
//   private readonly imgState = inject(ImageStateService);
//   private readonly destroyRef = inject(DestroyRef);


//   // Public readonly output for template
//   private readonly _outputUrl = signal<string | null>(null);
//   readonly outputUrl = this._outputUrl.asReadonly();
//   url = computed(() => this._outputUrl() as URL | null);


//   constructor() {
//     // Recompute when cv is ready or original image changes or params change
//     effect(() => {
//       // if (!this.cvLoader.ready()) return;
//       const cv = this.cvLoader.api();
//       const src = this.imgState.originalData();
//       const low = this.low();
//       const high = this.high();
//       if (cv && src != null) {
//         this._outputUrl.set(this.computeCanny(cv, src, low, high));
//       }
//     });


//     // Cleanup any object URL
//     this.destroyRef.onDestroy(() => {
//       const u = this._outputUrl();
//       if (u) URL.revokeObjectURL(u);
//     });
//   }


//   private computeCanny(cv: any, src: ImageData, low: number, high: number): string | null {
//     const mat = cv.matFromImageData(src);
//     const gray = new cv.Mat();
//     const edges = new cv.Mat();
//     try {
//       if (mat.channels() === 4) cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
//       else cv.cvtColor(mat, gray, cv.COLOR_RGB2GRAY);
//       cv.Canny(gray, edges, low, high);


//       const out = new ImageData(new Uint8ClampedArray(edges.data), edges.cols, edges.rows);
//       const canvas = document.createElement('canvas');
//       canvas.width = out.width; canvas.height = out.height;
//       canvas.getContext('2d')!.putImageData(out, 0, 0);
//       return canvas.toDataURL('image/png');
//     } finally {
//       mat.delete(); gray.delete(); edges.delete();
//     }
//   }


// }
