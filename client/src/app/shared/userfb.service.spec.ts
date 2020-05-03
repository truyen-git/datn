import { TestBed } from '@angular/core/testing';

import { UserfbService } from './userfb.service';

describe('UserfbService', () => {
  let service: UserfbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserfbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
