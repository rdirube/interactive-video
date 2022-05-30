import { TestBed } from '@angular/core/testing';

import { CreateVideoService } from './create-video.service';

describe('CreateVideoService', () => {
  let service: CreateVideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateVideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
