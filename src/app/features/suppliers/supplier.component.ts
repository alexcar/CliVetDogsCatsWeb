import { Component, Inject, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';
import { States } from './../../shared/states';
import { Supplier } from 'src/app/domain/supplier';
import { SupplierService } from 'src/app/services/supplier.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class SupplierComponent implements OnInit {

  id: string | null = null;
  submitted = false;
  action = '';
  supplierForm!: FormGroup;
  dutyVeterinarian = false;
  supplier = new Supplier();
  showSpinner = false;

  states: States[] = [
    { id: 'AC', name: 'Acre' },
    { id: 'AL', name: 'Alagoas' },
    { id: 'AP', name: 'Amapá' },
    { id: 'AM', name: 'Amazonas' },
    { id: 'BA', name: 'Bahia' },
    { id: 'CE', name: 'Ceará' },
    { id: 'ES', name: 'Espírito Santos' },
    { id: 'GO', name: 'Goiás' },
    { id: 'MA', name: 'Maranhão' },
    { id: 'MT', name: 'Mato Grosso' },
    { id: 'MS', name: 'Mato Grosso do Sul' },
    { id: 'MG', name: 'Minas Gerais' },
    { id: 'PA', name: 'Pará' },
    { id: 'PB', name: 'Paraíba' },
    { id: 'PR', name: 'Paraná' },
    { id: 'PE', name: 'Pernambuco' },
    { id: 'PI', name: 'Piauí' },
    { id: 'RJ', name: 'Rio de janeiro' },
    { id: 'RN', name: 'Rio Grande do Norte' },
    { id: 'RS', name: 'Rio Grandwe do Sul' },
    { id: 'RO', name: 'Rondônia' },
    { id: 'RR', name: 'Roraima' },
    { id: 'SC', name: 'Santa Catarina' },
    { id: 'SP', name: 'São Paulo' },
    { id: 'SE', name: 'Sergipe' },
    { id: 'TO', name: 'Tocantins' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private service: SupplierService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.createForm(this.id);
    this._locale = 'pt';
    this._adapter.setLocale(this._locale);

    if (this.id == null) {
      this.action = "Adicionar";
    } else {
      this.action = "Editar";
    }
  }

  createForm(id: string | null): void {
    this.supplier = new Supplier();

    if (id != null) {
      this.updateForm(id);
    }

    this.supplierForm = this.fb.group({
      id: [this.supplier.id],
      name: [this.supplier.name, Validators.required],
      trade: [this.supplier.trade, Validators.required],
      contact: [this.supplier.contact, Validators.required],
      email: [this.supplier.email, [Validators.required, Validators.email]],
      cnpj: [this.supplier.cnpj, Validators.required],
      phone: [this.supplier.phone],
      cellPhone: [this.supplier.cellPhone, Validators.required],
      active: [this.supplier.active],
      address: this.fb.group({
        id: [this.supplier.id],
        zipCode: [this.supplier.address.zipCode, Validators.required],
        streetAddress: [this.supplier.address.streetAddress, Validators.required],
        number: [this.supplier.address.number, Validators.required],
        complement: [this.supplier.address.complement],
        neighborhood: [this.supplier.address.neighborhood, Validators.required],
        city: [this.supplier.address.city, Validators.required],
        state: [this.supplier.address.state, Validators.required]
      }),
    });
  }

  get f() { return this.supplierForm; }

  onSubmit(): void {
    this.submitted = true;

    if (this.supplierForm.invalid) {
      return;
    }

    this.showSpinner = true;

    if (this.action == 'Adicionar') {
      this.service.addSupplier(this.supplierForm.value)
      .subscribe({
        next: (result) => {
          this.snackBar.open(
            "Fornecedor cadastrado com sucesso!", "OK",
            {
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });

           this.onReset();
        },
        error: (error) => {
          this.showSpinner = false;
          let duration: number = 5000;
          let errorMessages: string[] = [];
          errorMessages = error.message.split('|');

          if (errorMessages.length > 5) {
            duration = 10000;
          }

          let configError: MatSnackBarConfig = {
            panelClass: 'red-snackbar',
            duration: duration,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          };

          this.snackBar.openFromComponent(SnackBarComponent, {
            data: error.message.split('|'),
            ...configError
           });

          return of([])
        },
        complete: () => {
          this.showSpinner = false;
        }
      });
    } else {
      this.service.updateSupplier(this.supplierForm.value)
      .subscribe({
        next: (result) => {
          this.supplierForm.patchValue(result);

          this.snackBar.open(
            "Os dados foram alterados com sucesso!", "OK",
            {
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
        },
        error: (error) => {
          this.showSpinner = false;
          let duration: number = 5000;
          let errorMessages: string[] = [];
          errorMessages = error.message.split('|');

          if (errorMessages.length > 5) {
            duration = 10000;
          }

          let configError: MatSnackBarConfig = {
            panelClass: 'red-snackbar',
            duration: duration,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          };

          this.snackBar.openFromComponent(SnackBarComponent, {
            data: error.message.split('|'),
            ...configError
           });

          return of([])
        },
        complete: () => {
          this.showSpinner = false;
        }
      });
    }
  }

  cancelForm(): void {
    this.router.navigateByUrl('list-suppliers');
  }

  onReset(): void {
    this.submitted = false;
    this.supplierForm.reset();

    for (let name in this.supplierForm.controls) {
      this.f.get(name)?.clearValidators();
      this.f.get(name)?.updateValueAndValidity();
    }

    this.f.get('address.zipCode')?.clearValidators();
    this.f.get('address.zipCode')?.updateValueAndValidity();

    this.f.get('address.streetAddress')?.clearValidators();
    this.f.get('address.streetAddress')?.updateValueAndValidity();

    this.f.get('address.number')?.clearValidators();
    this.f.get('address.number')?.updateValueAndValidity();

    this.f.get('address.neighborhood')?.clearValidators();
    this.f.get('address.neighborhood')?.updateValueAndValidity();

    this.f.get('address.city')?.clearValidators();
    this.f.get('address.city')?.updateValueAndValidity();

    this.f.get('address.state')?.clearValidators();
    this.f.get('address.state')?.updateValueAndValidity();
  }

  updateForm(id: string): void {
    this.showSpinner = true;

    this.service.getSupplierById(id)
      .subscribe({
        next: (result) => {
          this.supplierForm.patchValue(result);
          console.log(result);
        },
        error: (error) => {
          this.showSpinner = false;

          let configError: MatSnackBarConfig = {
            panelClass: 'red-snackbar',
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          };

          this.snackBar.openFromComponent(SnackBarComponent, {
            data: error.message.split('|'),
            ...configError
           });

           return of([])
        },
        complete: () => {
          this.showSpinner = false;
        }
      });
  }

  getEmailErrorMessage(): string {
    console.log(this.f.get('email')?.errors);

    if (this.f.get('email')?.hasError('required')) {
      return 'O campo e-mail é obrigatório'
    }

    return this.f.get('email')?.hasError('email') ? 'Informe um e-mail válido' : '';
  }

}
