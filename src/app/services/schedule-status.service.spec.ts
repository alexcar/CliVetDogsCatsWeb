import { TestBed } from '@angular/core/testing';

import { ScheduleStatusService } from './schedule-status.service';

describe('ScheduleStatusService', () => {
  let service: ScheduleStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
