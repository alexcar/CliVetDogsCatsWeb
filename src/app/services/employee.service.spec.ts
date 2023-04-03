import { EmployeeService } from './employee.service';
import { TestBed } from '@angular/core/testing';

describe('SearchEmployeeService', () => {
  let service: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
