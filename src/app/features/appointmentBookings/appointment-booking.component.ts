import { Component, OnInit, Inject, AfterContentChecked } from '@angular/core';
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
import { SelectedServiceProduct } from 'src/app/interfaces/selected-service-product';
import { MatDialog } from '@angular/material/dialog';
import { DialogDataComponent } from 'src/app/shared/dialog-data/dialog-data.component';
import { MatTableDataSource } from '@angular/material/table';
import { ScheduleServiceSelected } from 'src/app/domain/schedule-service-selected';
import { ScheduleProductSelected } from 'src/app/domain/schedule-product-selected';

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
export class AppointmentBookingComponent implements OnInit, AfterContentChecked {

  id: string | null = null;
  submitted = false;
  action = '';
  scheduleForm!: FormGroup;
  showSpinner = false;

  schedule = new Schedule();
  scheduleStatus: ListScheduleStatus[] = []
  vets: ListEmployee[] = [];
  tutors: ListTutor[] = [];
  animals: ListAnimal[] = [];
  scheduleServices: ListScheduleService[] = [];
  scheduleProducts: ListScheduleProduct[] = [];

  selectedServicesProducts: SelectedServiceProduct[] = [];
  selectedServiceProduct!: SelectedServiceProduct;
  selectedServiceId!: string;
  selectedProductId!: string;
  displayedColumns: string[] = ['name', 'saleValue', 'quantity', 'subTotal', 'actions'];
  dataSource: any;

  selectedStatus!: string | null;
  selectedVet!: string | null;
  selectedTutor!: string | null;
  selectedAnimal!: string | null;

  disableAddServiceButton = true;
  disableAddProductButton = true;
  currentScheduleStatus: string | undefined;
  scheduleStatusRealizado = false;
  displayListServicesproducts = false;
  scheduleStatusBefore: string | undefined;

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
    private dialog: MatDialog,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private snackBar: MatSnackBar,)
  { }

  ngAfterContentChecked(): void {
    // if (this.id == null) {
    //   const scheduleStatus = this.scheduleStatus.find(x => x.name === 'Agendado')?.id;
    //   this.f.get('scheduleStatusId')?.setValue(scheduleStatus);
    //   this.f.get('scheduleStatusId')?.disable();
    // }
  }

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

  setScheduleStatus(): void {
    const foo = this.f.get('scheduleStatusId')?.value;
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
      serviceId: [this.schedule.serviceId],
      serviceSaleValue: [this.schedule.serviceSaleValue],
      serviceQuantity: [this.schedule.serviceQuantity],
      serviceTotalValue: [this.schedule.serviceTotalValue],
      productId: [this.schedule.productId],
      productSaleValue: [this.schedule.productSaleValue],
      productQuantity: [this.schedule.productQuantity],
      productTotalValue: [this.schedule.productTotalValue],
    });

    this.scheduleForm.get('animalId')?.disable();
    this.scheduleForm.get('serviceSaleValue')?.disable();
    this.scheduleForm.get('serviceTotalValue')?.disable();
    this.scheduleForm.get('productSaleValue')?.disable();
    this.scheduleForm.get('productTotalValue')?.disable();
  }

  get f() { return this.scheduleForm; }

  updateForm(id: string): void {
    this.showSpinner = true;

    this.service.getScheduleById(id)
      .subscribe({
        next: (result) => {

          this.getAnimals(result.tutorId, result.animalId);

          result.scheduleServiceSelected?.forEach(element => {
            let selectedService: SelectedServiceProduct = {
              id: element.serviceId,
              name: element.serviceName,
              quantity: 1,
              saleValue: element.saleValue,
              type: 'service',
              subTotal: element.saleValue * 1
            };

            this.selectedServicesProducts.push(selectedService);
          });

          result.scheduleProductSelected?.forEach(element => {
            let selectedProduct: SelectedServiceProduct = {
              id: element.productId,
              name: element.productName,
              quantity: 1,
              saleValue: element.saleValue,
              type: 'product',
              subTotal: element.saleValue * 1
            };

            this.selectedServicesProducts.push(selectedProduct);
          });

          this.dataSource = new MatTableDataSource(this.selectedServicesProducts);

          this.scheduleForm.patchValue(result);
          const scheduleStatus = result.scheduleStatus;
          const currentScheduleStatus = scheduleStatus.find(x => x.id == result.scheduleStatusId)?.name;

          if (currentScheduleStatus == 'Realizado') {
            this.disableForm();
            this.scheduleStatusRealizado = false;
            this.displayListServicesproducts = true;
            this.displayedColumns.pop();
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

  onSubmit(): void {
    this.submitted = true;

    if (this.scheduleForm.invalid) {
      return;
    }

    this.showSpinner = true;

    if (this.action == 'Adicionar') {

      let newSchedule = new Schedule();

      newSchedule.scheduleDate = this.scheduleForm.get('scheduleDate')?.value;
      newSchedule.hour = this.scheduleForm.get('hour')?.value;
      newSchedule.tutorComments = this.scheduleForm.get('tutorComments')?.value;
      newSchedule.scheduleComments = this.scheduleForm.get('scheduleComments')?.value;
      newSchedule.scheduleStatusId = this.scheduleForm.get('scheduleStatusId')?.value;
      newSchedule.employeeId = this.scheduleForm.get('employeeId')?.value;
      newSchedule.tutorId = this.scheduleForm.get('tutorId')?.value;
      newSchedule.animalId = this.scheduleForm.get('animalId')?.value;

      this.service.addSchedule(newSchedule)
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

      let newSchedule = new Schedule();

      newSchedule.id = this.id;
      newSchedule.scheduleDate = this.scheduleForm.get('scheduleDate')?.value;
      newSchedule.hour = this.scheduleForm.get('hour')?.value;
      newSchedule.tutorComments = this.scheduleForm.get('tutorComments')?.value;
      newSchedule.scheduleComments = this.scheduleForm.get('scheduleComments')?.value;
      newSchedule.scheduleStatusId = this.scheduleForm.get('scheduleStatusId')?.value;
      newSchedule.employeeId = this.scheduleForm.get('employeeId')?.value;
      newSchedule.tutorId = this.scheduleForm.get('tutorId')?.value;
      newSchedule.animalId = this.scheduleForm.get('animalId')?.value;

      if (this.currentScheduleStatus === 'Realizado') {
        this.selectedServicesProducts.forEach(element => {
          if (element.type == 'service') {
            const scheduleService: ScheduleServiceSelected = {
              serviceId: element.id,
              serviceName: '',
              saleValue: 0

            }

            newSchedule.scheduleServiceSelected?.push(scheduleService);
          } else {
            const scheduleProduct: ScheduleProductSelected = {
              productId: element.id,
              productName: '',
              saleValue: 0,
              quantity: element.quantity,
            }

            newSchedule.scheduleProductSelected?.push(scheduleProduct);
          }
        });
      }

      this.service.updateSchedule(newSchedule)
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

  getTotal(): number {
    return this.selectedServicesProducts.map(x => x.subTotal).reduce((acc, value) => acc + value);
  }

  removeProduct(selectedServiceProduct: SelectedServiceProduct): void {
    let type = 'serviço';

    if (selectedServiceProduct.type === 'product') {
      type = 'produto';
    }
    const dialogRef = this.dialog.open(DialogDataComponent, {
      data: {
        message: `Confirma a exclusão do ${type} ${selectedServiceProduct.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe( result => {
      if (result === true) {
        this.dataSource = this.selectedServicesProducts.filter((value, key) => {
          return value.id != selectedServiceProduct.id;
        });

        this.selectedServicesProducts = this.selectedServicesProducts.filter((value, key) => {
          return value.id != selectedServiceProduct.id;
        });

        this.dataSource = new MatTableDataSource(this.selectedServicesProducts)
      }
    });
  }

  manageForm(): void {
    this.f.get('tutorId')?.valueChanges.subscribe(
      value => {
        if (value != null) {
          this.getAnimals(value, null);

          if (this.currentScheduleStatus != 'Realizado') {
            this.scheduleForm.get('animalId')?.enable();
          }
        }
      }
    )

    this.f.get('serviceId')?.valueChanges.subscribe(
      value => {
        if (value != null) {
          const service = this.scheduleServices.find(x => x.id == value);
          const quantity = 1;
          const type = 'service';

          if (service) {
            this.f.get('serviceSaleValue')?.setValue(service.saleValue);
            this.f.get('serviceQuantity')?.setValue(quantity);

            const subTotal = service?.saleValue * quantity;
            this.f.get('serviceTotalValue')?.setValue(subTotal);

            this.selectedServiceProduct = {
              id: service.id,
              name: service.name,
              saleValue: service.saleValue,
              quantity: quantity,
              subTotal: subTotal,
              type: type
            };

            this.disableAddServiceButton = false;
          }
        }
      }
    )

    this.f.get('serviceQuantity')?.valueChanges.subscribe(
      value => {
        if (value != null && value > 0 && this.f.get('serviceId')?.value != null) {
          const subTotal = this.selectedServiceProduct.saleValue?? 0 * value;
          this.f.get('serviceTotalValue')?.setValue(subTotal);
          this.selectedServiceProduct.quantity = value;
          this.selectedServiceProduct.subTotal = subTotal;

          this.disableAddServiceButton = false;
        } else {
          this.f.get('serviceTotalValue')?.setValue(null);
          this.disableAddServiceButton = true;
        }
      }
    )

    this.f.get('productId')?.valueChanges.subscribe(
      value => {
        if (value != null) {
          const product = this.scheduleProducts.find(x => x.id == value);
          let quantity = 1;
          const type = 'product';

          if (product) {
            this.f.get('productSaleValue')?.setValue(product.saleValue);
            this.f.get('productQuantity')?.setValue(quantity);

            const subTotal = product?.saleValue * quantity;
            this.f.get('productTotalValue')?.setValue(subTotal);

            this.selectedServiceProduct = {
              id: product.id,
              name: product.name,
              saleValue: product.saleValue,
              quantity: quantity,
              subTotal: subTotal,
              type: type
            };

            this.disableAddProductButton = false;
          }
        }
      }
    )

    this.f.get('productQuantity')?.valueChanges.subscribe(
      value => {
        if (value != null && value > 0 && this.f.get('productId')?.value != null) {
          const subTotal = this.selectedServiceProduct.saleValue?? 0 * value;
          this.f.get('productTotalValue')?.setValue(subTotal);
          this.selectedServiceProduct.quantity = value;
          this.selectedServiceProduct.subTotal = subTotal;

          this.disableAddProductButton = false;
        } else {
          this.f.get('productTotalValue')?.setValue(null);
          this.disableAddProductButton = true;
        }
      }
    );

    this.f.get('scheduleStatusId')?.valueChanges.subscribe(
      value => {
        if (this.id == null) {
          this.f.get('scheduleStatusId')?.disable();
          return;
        }

        this.currentScheduleStatus = this.scheduleStatus.find(x => x.id === value)?.name;
        this.scheduleStatusRealizado = false;
        this.displayListServicesproducts = false;

        if (this.scheduleStatusBefore == undefined && this.currentScheduleStatus == 'Realizado') {
          // disable form
          // this.f.get('scheduleStatusId')?.disable();
          // this.disableForm();
          return;
        }

        if (this.currentScheduleStatus === 'Agendado' || this.currentScheduleStatus === 'Cancelado') {
          // delete Realizado
          this.scheduleStatus = this.scheduleStatus.filter((value, key) => {
            return value.name != 'Realizado';
          });
        } else if (this.currentScheduleStatus === 'Andamento') {
          // delete Agendado
          this.scheduleStatus = this.scheduleStatus.filter((value, key) => {
            return value.name != 'Agendado';
          });
        } else if (this.currentScheduleStatus === 'Realizado') {
          this.scheduleStatusRealizado = true;
          this.displayListServicesproducts = true;
          this.f.get('scheduleStatusId')?.disable();
        }

        this.scheduleStatusBefore = this.currentScheduleStatus;
      }
    )
  }

  disableForm(): void {
    this.f.get('scheduleDate')?.disable();
    this.f.get('hour')?.disable();
    this.f.get('scheduleStatusId')?.disable();
    this.f.get('employeeId')?.disable();
    this.f.get('scheduleComments')?.disable();
    this.f.get('tutorId')?.disable();
    this.f.get('animalId')?.disable();
    this.f.get('tutorComments')?.disable();
  }

  addService(): void {
    this.selectedServicesProducts.push(this.selectedServiceProduct);
    this.dataSource = new MatTableDataSource(this.selectedServicesProducts);
    this.f.get('serviceId')?.setValue(undefined);
    this.f.get('serviceSaleValue')?.setValue(undefined);
    this.f.get('serviceQuantity')?.setValue(undefined);
    this.f.get('serviceQuantity')?.clearValidators();
    this.f.get('serviceQuantity')?.updateValueAndValidity();
    this.f.get('serviceTotalValue')?.setValue(undefined);
  }

  addProduct(): void {
    this.selectedServicesProducts.push(this.selectedServiceProduct);
    this.dataSource = new MatTableDataSource(this.selectedServicesProducts);
    this.f.get('productId')?.setValue(undefined);
    this.f.get('productSaleValue')?.setValue(undefined);
    this.f.get('productQuantity')?.setValue(undefined);
    this.f.get('productQuantity')?.clearValidators();
    this.f.get('productQuantity')?.updateValueAndValidity();
    this.f.get('productTotalValue')?.setValue(undefined);
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

    this.selectedServicesProducts = [];
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
    this.showSpinner = true;

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
      },
      complete: () => {
        this.showSpinner = false;
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
        },
        complete: () => {
          this.showSpinner = false;
        }
      });
  }
}
