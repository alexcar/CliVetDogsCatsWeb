import { Employee } from './../../domain/employee';
import 'moment/locale/br';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from '@angular/material-moment-adapter';

import { States } from './../../shared/states';
import { EmployeeService } from 'src/app/services/employee.service';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class EmployeeComponent implements OnInit {
  id: string | null = null;
  submitted = false;
  action = '';
  employeeForm!: FormGroup;
  dutyVeterinarian = false;
  employee = new Employee();
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
    private service: EmployeeService,
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

    this.manageForm();
  }

  createForm(id: string | null): void {
    this.employee = new Employee();

    if (id != null) {
      this.updateForm(id);
    }

    this.employeeForm = this.fb.group({
      id: [this.employee.id],
      name: [this.employee.name, Validators.required],
      cpf: [this.employee.cpf, Validators.required],
      rg: [this.employee.rg, Validators.required],
      gender: [this.employee.gender, Validators.required],
      phone: [this.employee.phone],
      cellPhone: [this.employee.cellPhone, Validators.required],
      email: [this.employee.email, [Validators.required, Validators.email]],
      admissionDate: [this.employee.admissionDate, Validators.required],
      isVeterinarian: [this.employee.isVeterinarian],
      active: [this.employee.active],

      address: this.fb.group({
        id: [this.employee.id],
        zipCode: [this.employee.address.zipCode, Validators.required],
        streetAddress: [this.employee.address.streetAddress, Validators.required],
        number: [this.employee.address.number, Validators.required],
        complement: [this.employee.address.complement],
        neighborhood: [this.employee.address.neighborhood, Validators.required],
        city: [this.employee.address.city, Validators.required],
        state: [this.employee.address.state, Validators.required]
      }),

      workShift: this.fb.group({
        id: [this.employee.workShift.id],
        monday: [this.employee.workShift.monday],
        mondayFrom: [this.employee.workShift.mondayFrom],
        mondayTo: [this.employee.workShift.mondayTo],
        tuesday: [this.employee.workShift.tuesday],
        tuesdayFrom: [this.employee.workShift.tuesdayFrom],
        tuesdayTo: [this.employee.workShift.tuesdayTo],
        wednesday: [this.employee.workShift.wednesday],
        wednesdayFrom: [this.employee.workShift.wednesdayFrom],
        wednesdayTo: [this.employee.workShift.wednesdayTo],
        thursday: [this.employee.workShift.thursday],
        thursdayFrom: [this.employee.workShift.thursdayFrom],
        thursdayTo: [this.employee.workShift.thursdayTo],
        friday: [this.employee.workShift.friday],
        fridayFrom: [this.employee.workShift.fridayFrom],
        fridayTo: [this.employee.workShift.fridayTo],
        saturday: [this.employee.workShift.saturday],
        saturdayFrom: [this.employee.workShift.saturdayFrom],
        saturdayTo: [this.employee.workShift.saturdayTo],
        sunday: [this.employee.workShift.sunday],
        sundayFrom: [this.employee.workShift.sundayFrom],
        sundayTo: [this.employee.workShift.sundayTo],
      }),
    });
  }

  get f() { return this.employeeForm; }

  onSubmit(): void {
    this.submitted = true;

    if (this.employeeForm.invalid) {
      return;
    }

    this.showSpinner = true;

    if (this.action == 'Adicionar') {
      this.service.addEmployee(this.employeeForm.value)
      .subscribe({
        next: (result) => {
          this.snackBar.open(
            "Funcionário(a) cadastrado com sucesso!", "OK",
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
      this.service.updateEmployee(this.employeeForm.value)
      .subscribe({
        next: (result) => {
          this.employeeForm.patchValue(result);

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
    this.router.navigateByUrl('list-employeers');
  }

  onReset(): void {
    this.submitted = false;
    this.employeeForm.reset();

    for (let name in this.employeeForm.controls) {
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
    // recupera o employee e atualiza as propriedades do objeto employee.
    this.showSpinner = true;

    this.service.getEmployeeById(id)
      .subscribe({
        next: (result) => {
          this.employeeForm.patchValue(result);
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

  manageForm(): void {
    this.f.get('dutyVeterinarian.dutyMonday')?.valueChanges.subscribe(
      value => {
        if (value) {
          this.f.get('dutyMondayFrom')?.enable();
          this.f.get('dutyMondayTo')?.enable();
        } else {
          this.f.get('dutyMondayFrom')?.setValue('');
          this.f.get('dutyMondayFrom')?.disable();
          this.f.get('dutyMondayTo')?.setValue('');
          this.f.get('dutyMondayTo')?.disable();
        }
      }
    )

    this.f.get('dutyTuesday')?.valueChanges.subscribe(
      value => {
        if (value) {
          this.f.get('dutyTuesdayFrom')?.enable();
          this.f.get('dutyTuesdayTo')?.enable();
        } else {
          this.f.get('dutyTuesdayFrom')?.setValue('');
          this.f.get('dutyTuesdayFrom')?.disable();
          this.f.get('dutyTuesdayTo')?.setValue('');
          this.f.get('dutyTuesdayTo')?.disable();
        }
      }
    )

    this.f.get('dutyWednesday')?.valueChanges.subscribe(
      value => {
        if (value) {
          this.f.get('dutyWednesdayFrom')?.enable();
          this.f.get('dutyWednesdayTo')?.enable();
        } else {
          this.f.get('dutyWednesdayFrom')?.setValue('');
          this.f.get('dutyWednesdayFrom')?.disable();
          this.f.get('dutyWednesdayTo')?.setValue('');
          this.f.get('dutyWednesdayTo')?.disable();
        }
      }
    )

    this.f.get('dutyThursday')?.valueChanges.subscribe(
      value => {
        if (value) {
          this.f.get('dutyThursdayFrom')?.enable();
          this.f.get('dutyThursdayTo')?.enable();
        } else {
          this.f.get('dutyThursdayFrom')?.setValue('');
          this.f.get('dutyThursdayFrom')?.disable();
          this.f.get('dutyThursdayTo')?.setValue('');
          this.f.get('dutyThursdayTo')?.disable();
        }
      }
    )

    this.f.get('dutyFriday')?.valueChanges.subscribe(
      value => {
        if (value) {
          this.f.get('dutyFridayFrom')?.enable();
          this.f.get('dutyFridayTo')?.enable();
        } else {
          this.f.get('dutyFridayFrom')?.setValue('');
          this.f.get('dutyFridayFrom')?.disable();
          this.f.get('dutyFridayTo')?.setValue('');
          this.f.get('dutyFridayTo')?.disable();
        }
      }
    )

    this.f.get('dutySaturday')?.valueChanges.subscribe(
      value => {
        if (value) {
          this.f.get('dutySaturdayFrom')?.enable();
          this.f.get('dutySaturdayTo')?.enable();
        } else {
          this.f.get('dutySaturdayFrom')?.setValue('');
          this.f.get('dutySaturdayFrom')?.disable();
          this.f.get('dutySaturdayTo')?.setValue('');
          this.f.get('dutySaturdayTo')?.disable();
        }
      }
    )

    this.f.get('dutySunday')?.valueChanges.subscribe(
      value => {
        if (value) {
          this.f.get('dutySundayFrom')?.enable();
          this.f.get('dutySundayTo')?.enable();
        } else {
          this.f.get('dutySundayFrom')?.setValue('');
          this.f.get('dutySundayFrom')?.disable();
          this.f.get('dutySundayTo')?.setValue('');
          this.f.get('dutySundayTo')?.disable();
        }
      }
    )

    this.f.get('isVeterinarian')?.valueChanges.subscribe(
      value => {
        this.dutyVeterinarian = value;
      }
    )
  }

  getEmailErrorMessage(): string {
    console.log(this.f.get('email')?.errors);

    if (this.f.get('email')?.hasError('required')) {
      return 'O campo e-mail é obrigatório'
    }

    return this.f.get('email')?.hasError('email') ? 'Informe um e-mail válido' : '';
  }
}
