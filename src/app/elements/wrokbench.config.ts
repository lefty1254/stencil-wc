import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';

import { provideEdgeApiBrowser, provideOpenCV } from 'opencv-ng';


export const workbenchConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideOpenCV(),
        provideEdgeApiBrowser()
    ]
};
