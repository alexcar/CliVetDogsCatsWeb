import { Component, Inject, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

import { Animal } from 'src/app/domain/animal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Gender } from 'src/app/shared/gender';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalService } from 'src/app/services/animal.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';
import { of } from 'rxjs';
import { ListTutor } from 'src/app/interfaces/list-tutor';
import { TutorService } from 'src/app/services/tutor.service';
import { Species } from 'src/app/domain/species';
import { Race } from 'src/app/domain/race';
import { AnimalSize } from 'src/app/domain/animalSize';
import { AnimalSizeService } from 'src/app/services/animal-size.service';
import { RaceService } from 'src/app/services/race.service';
import { SpeciesService } from 'src/app/services/species.service';

@Component({
  selector: 'app-animal',
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class AnimalComponent implements OnInit {

  id: string | null = null;
  submitted = false;
  action = '';
  animalForm!: FormGroup;
  animal = new Animal();
  showSpinner = false;

  tutors: ListTutor[] = [];
  species!: Species[];
  races!: Race[];
  animalSizes!: AnimalSize[];

  maxDate = new Date();
  selectedBrand!: string | null;

  genders: Gender[] = [
    { id: 'F', name: 'Feminino' },
    { id: 'M', name: 'Masculino' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private service: AnimalService,
    private tutorService: TutorService,
    private speciesService: SpeciesService,
    private raceService: RaceService,
    private animalSizeService: AnimalSizeService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private snackBar: MatSnackBar,)
  { }

  ngOnInit(): void {
    this.showSpinner = true;
    this.getTutors();
    this.getSpecies();
    this.getAnimalSizes();

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

  getTutors(): void {
    this.tutorService.getListTutor()
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

  getSpecies(): void {
    this.speciesService.getAll()
      .subscribe({
        next: (result) => {
          this.species = result;
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

  getRacesBySpecies(id: string, selectedRaceId: string | null): void {
    this.showSpinner = true;

    this.raceService.getRacesBySpecies(id)
      .subscribe({
        next: (result) => {
          this.races = result;

          if (selectedRaceId != null) {
            this.selectedBrand = result.find(x => x.id == selectedRaceId)!.id;
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
        },
        complete: () => {
          this.showSpinner = false;
        }
      });
  }

  getAnimalSizes(): void {
    this.animalSizeService.getAll()
      .subscribe({
        next: (response) => {
          this.animalSizes = response;
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
      })
  }

  createForm(id: string | null): void {
    this.animal = new Animal();

    if (id != null) {
      this.updateForm(id);
    }

    this.animalForm = this.fb.group({
      id: [this.animal.id],
      tutorId: [this.animal.tutorId, Validators.required],
      name: [this.animal.name, Validators.required],
      speciesId: [this.animal.speciesId, Validators.required],
      raceId: [this.animal.raceId, Validators.required],
      coat: [this.animal.coat, Validators.required],
      birthDate: [this.animal.birthDate, Validators.required],
      weigth: [this.animal.weigth, Validators.required],
      animalSizeId: [this.animal.animalSizeId, Validators.required],
      sexoId: [this.animal.sexoId, Validators.required],
      comments: [this.animal.comments],
      active: [this.animal.active],
    });

    this.animalForm.get('raceId')?.disable();
  }

  get f() { return this.animalForm; }

  updateForm(id: string): void {
    this.showSpinner = true;

    this.service.getAnimalById(id)
      .subscribe({
        next: (result) => {
          this.animalForm.patchValue(result);
          this.getRacesBySpecies(result.speciesId, result.raceId);
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

    if (this.animalForm.invalid) {
      return;
    }

    this.showSpinner = true;

    if (this.action == 'Adicionar') {
      this.service.addAnimal(this.animalForm.value)
      .subscribe({
        next: (result) => {
          this.snackBar.open(
            "Animal cadastrado com sucesso!", "OK",
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
      this.service.updateAnimal(this.animalForm.value)
      .subscribe({
        next: (result) => {
          this.animalForm.patchValue(result);

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
    this.f.get('speciesId')?.valueChanges.subscribe(
      value => {
        if (value != null) {
          this.getRacesBySpecies(value, null);
          this.animalForm.get('raceId')?.enable();
        }
      }
    )
  }

  cancelForm(): void {
    this.router.navigateByUrl('list-animals');
  }

  onReset(): void {
    this.submitted = false;
    this.animalForm.reset();

    for (const name in this.animalForm.controls) {
      this.f.get(name)?.clearValidators();
      this.f.get(name)?.updateValueAndValidity();
    }
  }
}
