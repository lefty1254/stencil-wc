import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { EDGE_API } from '../common/edge.token';
import { CvEdgeApi } from './cv-edge-api.service';

// Extend later with a config to choose 'browser' | 'http'
export function provideEdgeApiBrowser(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: EDGE_API, useExisting: CvEdgeApi }
  ]);
}
