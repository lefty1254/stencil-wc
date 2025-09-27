/*
 * Public API Surface of opencv-ng
 */

// common (contracts)
export * from './lib/common/edge.types';
export * from './lib/common/edge.token';
export * from './lib/common/opencv.token';

// runtime (initialization)
export * from './lib/runtime/provide-opencv';
// implementations / binding
export * from './lib/impl/cv-edge-api.service';
export * from './lib/impl/provide-edge-api';
