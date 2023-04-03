import { CommonModule } from '@angular/common';
import { CpfCnpjPipe } from './cpf-cnpj.pipe';
import { MaterialDesignModule } from './../material-design/material-design.module';
import { NgModule } from '@angular/core';
import { PhonePipe } from './phone.pipe';
import { PsSidenavComponent } from './ps-sidenav/ps-sidenav.component';
import { RouterModule } from '@angular/router';
import { SnackBarComponent } from './snack-bar/snack-bar.component';
import { DialogDataComponent } from './dialog-data/dialog-data.component';

@NgModule({
  declarations: [
    PsSidenavComponent,
    SnackBarComponent,
    CpfCnpjPipe,
    PhonePipe,
    DialogDataComponent
  ],
  imports: [
    CommonModule,
    MaterialDesignModule,
    RouterModule
  ],
  exports: [ PsSidenavComponent, CpfCnpjPipe, PhonePipe ]
})
export class SharedModule { }
