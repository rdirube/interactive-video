import { TestBed } from '@angular/core/testing';

import { InteractiveVideoComposeService } from './interactive-video-compose.service';

describe('InteractiveVideoComposeService', () => {
  let service: InteractiveVideoComposeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteractiveVideoComposeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
