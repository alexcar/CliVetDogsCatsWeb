import { RouterModule, Routes } from '@angular/router';

import { AnimalComponent } from './features/animals/animal.component';
import { AnimalReportComponent } from './features/animals/animal-report.component';
import { AppointmentBookingComponent } from './features/appointmentBookings/appointment-booking.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EmployeeComponent } from './features/employees/employee.component';
import { EmployeeReportComponent } from './features/employees/employee-report.component';
import { ListAnimalsComponent } from './features/animals/list-animals.component';
import { ListAppointmentBookingsComponent } from './features/appointmentBookings/list-appointment-bookings.component';
import { ListEmployeesComponent } from './features/employees/list-employees.component';
import { ListProductsComponent } from './features/products/list-products.component';
import { ListStockReceiptsComponent } from './features/stockReceipts/list-stock-receipts.component';
import { ListSuppliersComponent } from './features/suppliers/list-suppliers.component';
import { ListTutoresComponent } from './features/tutores/list-tutores.component';
import { NgModule } from '@angular/core';
import { ProductComponent } from './features/products/product.component';
import { StockReceiptComponent } from './features/stockReceipts/stock-receipt.component';
import { SupplierComponent } from './features/suppliers/supplier.component';
import { SupplierReportComponent } from './features/suppliers/supplier-report.component';
import { TutorComponent } from './features/tutores/tutor.component';
import { TutorReportComponent } from './features/tutores/tutor-report.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },

  { path: 'list-employeers', component: ListEmployeesComponent },
  { path: 'employee/add', component: EmployeeComponent },
  { path: 'employee/edit/:id', component: EmployeeComponent },
  { path: 'employee/report', component: EmployeeReportComponent },

  { path: 'list-suppliers', component: ListSuppliersComponent },
  { path: 'supplier/add', component: SupplierComponent },
  { path: 'supplier/edit/:id', component: SupplierComponent },
  { path: 'supplier/report', component: SupplierReportComponent },

  { path: 'list-products', component: ListProductsComponent },
  { path: 'product/add', component: ProductComponent },
  { path: 'product/edit/:id', component: ProductComponent },

  { path: 'list-stock-receipts', component: ListStockReceiptsComponent },
  { path: 'stock-receipt/add', component: StockReceiptComponent },
  { path: 'stock-receipt/details/:id', component: StockReceiptComponent },

  { path: 'list-tutors', component: ListTutoresComponent },
  { path: 'tutor/add', component: TutorComponent },
  { path: 'tutor/edit/:id', component: TutorComponent },
  { path: 'tutor/report', component: TutorReportComponent },

  { path: 'list-animals', component: ListAnimalsComponent },
  { path: 'animal/add', component: AnimalComponent },
  { path: 'animal/edit/:id', component: AnimalComponent },
  { path: 'animal/report', component: AnimalReportComponent },

  { path: 'list-appointment-bookings', component: ListAppointmentBookingsComponent },
  { path: 'appointment-booking/add', component: AppointmentBookingComponent },
  { path: 'appointment-booking/edit/:id', component: AppointmentBookingComponent },


  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
