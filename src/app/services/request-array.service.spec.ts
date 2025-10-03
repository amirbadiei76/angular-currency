import { TestBed } from '@angular/core/testing';

import { RequestArrayService } from './request-array.service';

describe('RequestArrayService', () => {
  let service: RequestArrayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestArrayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
