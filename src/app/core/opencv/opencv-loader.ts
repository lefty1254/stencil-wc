// src/app/core/opencv/opencv-loader.service.ts
import { Injectable, computed, resource } from '@angular/core';
import cvReady from '@techstark/opencv-js';

// The resolved type of the package's default export (a Promise)
// export type OpenCvApi = Awaited<typeof cvReady>;

@Injectable({ providedIn: 'root' })
export class OpenCvLoaderService {
  // A resource that resolves once to the cv API.
  // If you later want to switch sources, make "request" depend on a signal.
  readonly cvRes = resource({
    loader: async () =>{
      const cv = await cvReady; // wait for the promise to resolve
      // You can do any additional setup here if needed
      return cv;
    }, // await the TechStark promise
  });

  // Convenience readonly computeds
  readonly api   = computed(() => this.cvRes.value());   // OpenCvApi | null while pending
  readonly ready = computed(() => this.cvRes.hasValue()); // boolean
  readonly error = computed(() => this.cvRes.error());    // unknown | null
}
