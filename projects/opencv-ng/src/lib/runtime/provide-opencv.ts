// projects/opencv-ng/src/lib/runtime/provide-opencv.ts
import { EnvironmentProviders, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { OPENCV, type CV } from '../common/opencv.token';

async function loadOpenCV(): Promise<CV> {
  const mod = await import('@techstark/opencv-js');
  const cv = (mod as any).default ?? mod;     // <-- default export in techstark
  // wait for Emscripten runtime (covers both styles)
  if (cv?.ready?.then) {
    await cv.ready;
  } else if (typeof cv?.onRuntimeInitialized !== 'undefined') {
    await new Promise<void>(res => { cv.onRuntimeInitialized = () => res(); });
  }
  return cv as CV;
}

export function provideOpenCV(): EnvironmentProviders {
  const ref: { cv: CV | null } = { cv: null };
  return makeEnvironmentProviders([
    provideAppInitializer(async () => { ref.cv = await loadOpenCV(); }),
    { provide: OPENCV, useFactory: () => {
        if (!ref.cv) throw new Error('OpenCV failed to initialize');
        return ref.cv;
      }
    }
  ]);
}
