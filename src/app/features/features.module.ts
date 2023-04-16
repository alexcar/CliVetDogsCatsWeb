import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import { AnimalComponent } from './animals/animal.component';
import { AppointmentBookingComponent } from './appointmentBookings/appointment-booking.component';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employees/employee.component';
import { ListAnimalsComponent } from './animals/list-animals.component';
import { ListAppointmentBookingsComponent } from './appointmentBookings/list-appointment-bookings.component';
import { ListEmployeesComponent } from './employees/list-employees.component';
import { ListProductsComponent } from './products/list-products.component';
import { ListStockReceiptsComponent } from './stockReceipts/list-stock-receipts.component';
import { ListSuppliersComponent } from './suppliers/list-suppliers.component';
import { ListTutoresComponent } from './tutores/list-tutores.component';
import { MaterialDesignModule } from './../material-design/material-design.module';
import { ProductComponent } from './products/product.component';
import { SharedModule } from './../shared/shared.module';
import { StockReceiptComponent } from './stockReceipts/stock-receipt.component';
import { SupplierComponent } from './suppliers/supplier.component';
import { TutorComponent } from './tutores/tutor.component';
import localePt from '@angular/common/locales/pt';
import {registerLocaleData} from '@angular/common';

registerLocaleData(localePt, 'pt');


@NgModule({
  declarations: [
    DashboardComponent,
    ListEmployeesComponent,
    EmployeeComponent,
    ListSuppliersComponent,
    SupplierComponent,
    ListProductsComponent,
    ProductComponent,
    ListStockReceiptsComponent,
    StockReceiptComponent,
    ListTutoresComponent,
    TutorComponent,
    ListAnimalsComponent,
    AnimalComponent,
    ListAppointmentBookingsComponent,
    AppointmentBookingComponent
  ],
  imports: [
    CommonModule,
    MaterialDesignModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    provideNgxMask(),
    {
      provide: LOCALE_ID,
      useValue: 'pt'
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'BRL'
    }
  ],
})
export class FeaturesModule { }
