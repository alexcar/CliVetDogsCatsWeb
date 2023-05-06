import { TestBed } from '@angular/core/testing';

import { AnimalSizeService } from './animal-size.service';

describe('AnimalSizeService', () => {
  let service: AnimalSizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimalSizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
