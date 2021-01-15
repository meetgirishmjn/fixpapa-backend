import { TestBed, inject } from '@angular/core/testing';

import { ResizeImageService } from './resize-image.service';

describe('ResizeImageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResizeImageService]
    });
  });

  it('should be created', inject([ResizeImageService], (service: ResizeImageService) => {
    expect(service).toBeTruthy();
  }));
});
