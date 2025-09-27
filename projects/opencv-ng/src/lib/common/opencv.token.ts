import { InjectionToken } from '@angular/core';
export type CV = typeof import('@techstark/opencv-js');
export const OPENCV = new InjectionToken<CV>('OPENCV');
