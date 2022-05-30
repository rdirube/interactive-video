import { TestBed } from '@angular/core/testing';

import { InteractiveVideoService } from './interactive-video.service';

describe('InteractiveVideoService', () => {
  let service: InteractiveVideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteractiveVideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
