import { TestBed, inject } from '@angular/core/testing';

import { GlobalFunctionService } from './global-function.service';

describe('GlobalFunctionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalFunctionService]
    });
  });

  it('should be created', inject([GlobalFunctionService], (service: GlobalFunctionService) => {
    expect(service).toBeTruthy();
  }));
});
