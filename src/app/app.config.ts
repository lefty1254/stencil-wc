import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { EDGE_API } from './core/opencv/edge.token';
import { CvEdgeApi } from './core/opencv/cv-edge-api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    { provide: EDGE_API, useExisting: CvEdgeApi}
  ]
};
