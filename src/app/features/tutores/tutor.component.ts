import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tutor } from 'src/app/domain/tutor';
import { States } from 'src/app/shared/states';
import { ActivatedRoute, Router } from '@angular/router';
import { TutorService } from 'src/app/services/tutor.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';
import { of } from 'rxjs';
import { Months } from 'src/app/shared/months';

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class TutorComponent implements OnInit {

  id: string | null = null;
  submitted = false;
  action = '';
  tutorForm!: FormGroup;
  dutyVeterinarian = false;
  tutor = new Tutor();
  showSpinner = false;

  months: Months[] =[
    { id: '01', name: 'Janeiro' },
    { id: '02', name: 'Fevereiro' },
    { id: '03', name: 'Março' },
    { id: '04', name: 'Abril' },
    { id: '05', name: 'Maio' },
    { id: '06', name: 'Junho' },
    { id: '07', name: 'Julho' },
    { id: '08', name: 'Agosto' },
    { id: '09', name: 'Setembro' },
    { id: '10', name: 'Outubro' },
    { id: '11', name: 'Novembro' },
    { id: '12', name: 'Dezembro' },
  ];

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
    private service: TutorService,
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
    this.tutor = new Tutor();

    if (id != null) {
      this.updateForm(id);
    }

    this.tutorForm = this.fb.group({
      id: [this.tutor.id],
      name: [this.tutor.name, Validators.required],
      cpf: [this.tutor.cpf, Validators.required],
      rg: [this.tutor.rg, Validators.required],
      dayBirth: [this.tutor.dayBirth],
      monthBirth: [this.tutor.monthBirth],
      phone: [this.tutor.phone],
      cellPhone: [this.tutor.cellPhone, Validators.required],
      email: [this.tutor.email, [Validators.required, Validators.email]],
      active: [this.tutor.active],
      comments: [this.tutor.comments],
      address: this.fb.group({
        id: [this.tutor.id],
        zipCode: [this.tutor.address.zipCode, Validators.required],
        streetAddress: [this.tutor.address.streetAddress, Validators.required],
        number: [this.tutor.address.number, Validators.required],
        complement: [this.tutor.address.complement],
        neighborhood: [this.tutor.address.neighborhood, Validators.required],
        city: [this.tutor.address.city, Validators.required],
        state: [this.tutor.address.state, Validators.required]
      }),
    });
  }

  get f() { return this.tutorForm; }

  updateForm(id: string): void {
    this.showSpinner = true;

    this.service.getTutorById(id)
      .subscribe({
        next: (result) => {
          this.tutorForm.patchValue(result);
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

  onSubmit(): void {
    this.submitted = true;

    if (this.tutorForm.invalid) {
      return;
    }

    this.showSpinner = true;

    if (this.action == 'Adicionar') {
      this.service.addTutor(this.tutorForm.value)
      .subscribe({
        next: (result) => {
          this.snackBar.open(
            "Tutor cadastrado com sucesso!", "OK",
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
      this.service.updateTutor(this.tutorForm.value)
      .subscribe({
        next: (result) => {
          this.tutorForm.patchValue(result);

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
    this.router.navigateByUrl('list-tutors');
  }

  onReset(): void {
    this.submitted = false;
    this.tutorForm.reset();

    for (let name in this.tutorForm.controls) {
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

  getEmailErrorMessage(): string {
    console.log(this.f.get('email')?.errors);

    if (this.f.get('email')?.hasError('required')) {
      return 'O campo e-mail é obrigatório'
    }

    return this.f.get('email')?.hasError('email') ? 'Informe um e-mail válido' : '';
  }
}
