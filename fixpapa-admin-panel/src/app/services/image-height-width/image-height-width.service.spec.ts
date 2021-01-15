import { TestBed, inject } from '@angular/core/testing';

import { ImageHeightWidthService } from './image-height-width.service';

describe('ImageHeightWidthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageHeightWidthService]
    });
  });

  it('should be created', inject([ImageHeightWidthService], (service: ImageHeightWidthService) => {
    expect(service).toBeTruthy();
  }));
});
