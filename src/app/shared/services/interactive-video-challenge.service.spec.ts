import { TestBed } from '@angular/core/testing';

import { InteractiveVideoChallengeService } from './interactive-video-challenge.service';

describe('InteractiveVideoChallengeService', () => {
  let service: InteractiveVideoChallengeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteractiveVideoChallengeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
