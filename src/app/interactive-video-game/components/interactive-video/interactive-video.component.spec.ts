import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveVideoComponent } from './interactive-video.component';

describe('InteractiveVideoComponent', () => {
  let component: InteractiveVideoComponent;
  let fixture: ComponentFixture<InteractiveVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteractiveVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
