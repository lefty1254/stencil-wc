import { TestBed } from '@angular/core/testing';

import { OpencvLoader } from './opencv-loader';

describe('OpencvLoader', () => {
  let service: OpencvLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpencvLoader);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
