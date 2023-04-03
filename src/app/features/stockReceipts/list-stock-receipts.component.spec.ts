import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStockReceiptsComponent } from './list-stock-receipts.component';

describe('ListStockReceiptsComponent', () => {
  let component: ListStockReceiptsComponent;
  let fixture: ComponentFixture<ListStockReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListStockReceiptsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListStockReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
