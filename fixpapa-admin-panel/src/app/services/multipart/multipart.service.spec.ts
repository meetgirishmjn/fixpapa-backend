import { TestBed, inject } from '@angular/core/testing';

import { MultipartService } from './multipart.service';

describe('MultipartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MultipartService]
    });
  });

  it('should be created', inject([MultipartService], (service: MultipartService) => {
    expect(service).toBeTruthy();
  }));
});
