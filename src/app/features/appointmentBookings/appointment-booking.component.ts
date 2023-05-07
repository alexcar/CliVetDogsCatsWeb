import { Component, OnInit, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListAnimal } from 'src/app/interfaces/list-animal';
import { ListEmployee } from 'src/app/interfaces/listEmployee';
import { ListScheduleProduct } from 'src/app/interfaces/list-schedule-product';
import { ListScheduleService } from 'src/app/interfaces/list-schedule-service';
import { ListScheduleStatus } from 'src/app/interfaces/list-schedule-status';
import { ListTutor } from 'src/app/interfaces/list-tutor';
import { Schedule } from 'src/app/domain/schedule';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalService } from 'src/app/services/animal.service';
import { TutorService } from 'src/app/services/tutor.service';
import { ScheduleStatusService } from 'src/app/services/schedule-status.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { ScheduleServiceService } from 'src/app/services/schedule-service.service';
import { ProductService } from 'src/app/services/product.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-appointment-booking',
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class AppointmentBookingComponent implements OnInit {

  id: string | null = null;
  submitted = false;
  action = '';
  scheduleForm!: FormGroup;
  animal = new Schedule();
  showSpinner = false;

  schedule = new Schedule();
  scheduleStatus: ListScheduleStatus[] = []
  vets: ListEmployee[] = [];
  tutors: ListTutor[] = [];
  animals: ListAnimal[] = [];
  scheduleServices: ListScheduleService[] = [];
  scheduleProducts: ListScheduleProduct[] = [];

  selectedStatus!: string | null;
  selectedVet!: string | null;
  selectedTutor!: string | null;
  selectedAnimal!: string | null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private service: ScheduleService,
    private scheduleStatusService: ScheduleStatusService,
    private employeerService: EmployeeService,
    private tutorService: TutorService,
    private animalService: AnimalService,
    private scheduleService: ScheduleServiceService,
    private productService: ProductService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private snackBar: MatSnackBar,)
  { }

  ngOnInit(): void {
    this.showSpinner = true;
    this.getScheduleStatus();
    this.getAllVet();
    this.getTutors();
    this.getScheduleServices();
    this.getScheduleProducts();

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

  getScheduleStatus(): void {
    this.scheduleStatusService.getAll()
      .subscribe({
        next: (result) => {
          this.scheduleStatus = result;
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
        }
      });
  }

  getAllVet(): void {
    this.employeerService.getAllVet()
      .subscribe({
        next: (result) => {
          this.vets = result;
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
        }
      });
  }

  getTutors(): void {
    this.tutorService.GetAllTutorsHaveAnimal()
      .subscribe({
        next: (result) => {
          this.tutors = result;
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
        }
      });
  }

  getAnimals(tutorId: string, selectedAnimalId: string | null): void {
    this.animalService.getByTutorId(tutorId)
    .subscribe({
      next: (result) => {
        this.animals = result;

        if (selectedAnimalId != null) {
          this.selectedAnimal = result.find(x => x.id == selectedAnimalId)!.id;
        }
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
      }
    });
  }

  getScheduleServices(): void {
    this.scheduleService.getListScheduleService()
      .subscribe({
        next: (result) => {
          this.scheduleServices = result;
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
        }
      });
  }

  getScheduleProducts(): void {
    this.productService.getScheduleProducts()
      .subscribe({
        next: (result) => {
          this.scheduleProducts = result;
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
        }
      });
  }

  createForm(id: string | null): void {
    this.schedule = new Schedule();

    if (id != null) {
      this.updateForm(id);
    }

    this.scheduleForm = this.fb.group({
      id: [this.schedule.id],
      scheduleDate: [this.schedule.scheduleDate, Validators.required],
      hour: [this.schedule.hour, Validators.required],
      scheduleStatusId: [this.schedule.scheduleStatusId, Validators.required],
      employeeId: [this.schedule.employeeId, Validators.required],
      scheduleComments: [this.schedule.scheduleComments],
      tutorId: [this.schedule.tutorId, Validators.required],
      animalId: [this.schedule.animalId, Validators.required],
      tutorComments: [this.schedule.tutorComments],
      active: [this.schedule.active],
    });

    this.scheduleForm.get('animalId')?.disable();
  }

  get f() { return this.scheduleForm; }

  updateForm(id: string): void {
    this.showSpinner = true;

    this.service.getScheduleById(id)
      .subscribe({
        next: (result) => {
          this.scheduleForm.patchValue(result);
          this.getAnimals(result.tutorId, result.animalId);
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

    if (this.scheduleForm.invalid) {
      return;
    }

    this.showSpinner = true;

    if (this.action == 'Adicionar') {
      this.service.addSchedule(this.scheduleForm.value)
      .subscribe({
        next: (result) => {
          this.snackBar.open(
            "Consulta agendada com sucesso!", "OK",
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
      this.service.updateSchedule(this.scheduleForm.value)
      .subscribe({
        next: (result) => {
          this.scheduleForm.patchValue(result);

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

  manageForm(): void {
    this.f.get('tutorid')?.valueChanges.subscribe(
      value => {
        if (value != null) {
          this.getAnimals(value, null);
          this.scheduleForm.get('animalId')?.enable();
        }
      }
    )
  }

  cancelForm(): void {
    this.router.navigateByUrl('list-appointment-bookings');
  }

  onReset(): void {
    this.submitted = false;
    this.scheduleForm.reset();

    for (const name in this.scheduleForm.controls) {
      this.f.get(name)?.clearValidators();
      this.f.get(name)?.updateValueAndValidity();
    }
  }
}
