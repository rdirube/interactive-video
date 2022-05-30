import { TestBed } from '@angular/core/testing';

import { InteractiveVideoAnswerService } from './interactive-video-answer.service';

describe('InteractiveVideoAnswerService', () => {
  let service: InteractiveVideoAnswerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteractiveVideoAnswerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
