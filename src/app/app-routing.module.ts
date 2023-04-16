import { RouterModule, Routes } from '@angular/router';

import { AnimalComponent } from './features/animals/animal.component';
import { AppointmentBookingComponent } from './features/appointmentBookings/appointment-booking.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EmployeeComponent } from './features/employees/employee.component';
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
import { TutorComponent } from './features/tutores/tutor.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },

  { path: 'list-employeers', component: ListEmployeesComponent },
  { path: 'employee/add', component: EmployeeComponent },
  { path: 'employee/edit/:id', component: EmployeeComponent },

  { path: 'list-suppliers', component: ListSuppliersComponent },
  { path: 'supplier/add', component: SupplierComponent },
  { path: 'supplier/edit/:id', component: SupplierComponent },

  { path: 'list-products', component: ListProductsComponent },
  { path: 'product/add', component: ProductComponent },
  { path: 'product/edit/:id', component: ProductComponent },

  { path: 'list-stock-receipts', component: ListStockReceiptsComponent },
  { path: 'stock-receipt', component: StockReceiptComponent },
  { path: 'list-tutores', component: ListTutoresComponent },
  { path: 'tutor', component: TutorComponent },
  { path: 'list-animals', component: ListAnimalsComponent },
  { path: 'animal', component: AnimalComponent },
  { path: 'list-appointment-bookings', component: ListAppointmentBookingsComponent },
  { path: 'appointment-booking', component: AppointmentBookingComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
