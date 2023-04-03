import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTutoresComponent } from './list-tutores.component';

describe('ListTutoresComponent', () => {
  let component: ListTutoresComponent;
  let fixture: ComponentFixture<ListTutoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTutoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTutoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
