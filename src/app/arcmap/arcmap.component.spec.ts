import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcmapComponent } from './arcmap.component';

describe('ArcmapComponent', () => {
  let component: ArcmapComponent;
  let fixture: ComponentFixture<ArcmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArcmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArcmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
