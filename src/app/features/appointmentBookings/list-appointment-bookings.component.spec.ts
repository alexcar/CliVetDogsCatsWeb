import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAppointmentBookingsComponent } from './list-appointment-bookings.component';

describe('ListAppointmentBookingsComponent', () => {
  let component: ListAppointmentBookingsComponent;
  let fixture: ComponentFixture<ListAppointmentBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAppointmentBookingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAppointmentBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
