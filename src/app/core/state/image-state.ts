import { Injectable, computed, resource, signal, inject, Signal } from '@angular/core';
import { EDGE_API } from 'opencv-ng';
import { CannyParams, EdgeAlgoId, EdgeApi, EdgeMask, EdgeParamsMap } from 'opencv-ng';

@Injectable({ providedIn: 'root' })
export class ImageStateService {
  private readonly api = inject<EdgeApi>(EDGE_API);

  // original pixels
  private readonly _src = signal<ImageData | null>(null);
  readonly src = this._src.asReadonly();
  readonly themeMode = signal(false);

  // size for aspect ratio
  readonly size = computed(() => {
    const s = this._src(); return s ? { w: s.width, h: s.height } : null;
  });

  // grayscale (async)
  readonly grayRes = resource<ImageData | null, ImageData | null>({
    params: (): ImageData | null => this._src(),
    loader: async ({ params }) => params ? await this.api.makeGray(params) : null,
  });

  private setCssVar(name: string, value: string | number) {
    document.documentElement.style.setProperty(name, String(value));
  }

  setDisplayCaps({ maxW, maxH, minW, minH }: { maxW?: number; maxH?: number; minW?: number; minH?: number }) {
    if (maxW != null) this.setCssVar('--disp-max-w', `${maxW}px`);
    if (maxH != null) this.setCssVar('--disp-max-h', `${maxH}px`); // <<< sys var for max height
    if (minW != null) this.setCssVar('--disp-min-w', `${minW}px`);
    if (minH != null) this.setCssVar('--disp-min-h', `${minH}px`);
  }

  async setSource(img: ImageData) {
    await this.api.setSource(img);
    this._src.set(img);

    this.setCssVar('--seed-w', img.width);
    this.setCssVar('--seed-h', img.height);
  }

  clear() {
    this._src.set(null);
    this.api.dispose();
    this.setCssVar('--seed-w', 0);
    this.setCssVar('--seed-h', 0);
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
        }
        catch (err) {
          reject(err);
        }
        finally {
          URL.revokeObjectURL(url);
        }
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  edgeMaskRes<A extends EdgeAlgoId>(algo: A, params: Signal<EdgeParamsMap[A]>) {
    return resource({
      params: () => {
        const src = this.src();            // dependency tracking
        const gray = this.grayRes.value(); // dependency tracking
        const p = params();                // actual algo params
        if (!src || !gray) return null;
        // Keep payload stable/minimal; API already uses its own gray
        return { algo, p, w: src.width, h: src.height } as const;
      },
      loader: async ({ params }) => {
        if (!params) return null;
        return await this.api.computeEdgeMask(params.algo, params.p);
      },
    });
  }


  /** Convenience wrapper for canny */
  cannyMaskRes(params: Signal<CannyParams>) {
    return this.edgeMaskRes(EdgeAlgoId.Canny, params);
  }
}
