import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsSidenavComponent } from './ps-sidenav.component';

describe('PsSidenavComponent', () => {
  let component: PsSidenavComponent;
  let fixture: ComponentFixture<PsSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsSidenavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
