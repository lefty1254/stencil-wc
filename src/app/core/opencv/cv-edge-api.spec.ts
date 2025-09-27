import { TestBed } from '@angular/core/testing';

import { CvEdgeApi } from './cv-edge-api';

describe('CvEdgeApi', () => {
  let service: CvEdgeApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CvEdgeApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
