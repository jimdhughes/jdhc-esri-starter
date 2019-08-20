import { TestBed } from '@angular/core/testing';

import { ArcmapService } from './arcmap.service';

describe('ArcmapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArcmapService = TestBed.get(ArcmapService);
    expect(service).toBeTruthy();
  });
});
