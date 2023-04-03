import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { DialogData } from './../../shared/dialog-data/dialog-data';
import { DialogDataComponent } from 'src/app/shared/dialog-data/dialog-data.component';
import { EmployeeService } from './../../services/employee.service';
import { ListEmployee } from 'src/app/interfaces/listEmployee';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Search } from 'src/app/domain/search';
import { SnackBarComponent } from './../../shared/snack-bar/snack-bar.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {

  displayedColumns: string[] = ['name', 'cpf', 'cellPhone', 'isVeterinarian', 'actions'];
  dataSource: any;
  isValidFormSubmitted = false;
  listEmployee: ListEmployee[] = [];
  dialogData!: DialogData;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  showSpinner = false;

  constructor(
    private service: EmployeeService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog) {}

  ngOnInit(): void {

    this.showSpinner = true;

    this.service.getListEmployee()
      .subscribe({
        next: (result) => {
          this.listEmployee = result;
          this.dataSource = new MatTableDataSource(this.listEmployee)
        },
        error: (error) => {
          this.showSpinner = false;

          let duration: number = 5000;
          let errorMessages: string[] = [];
          errorMessages = error.message.split('|');

          if (errorMessages.length > 5) {
            duration = 10000;
          }

          let config = new MatSnackBarConfig();
          config.duration = duration;
          config.data = error.message.split('|')
          config.panelClass = ["red-snackbar"];
          config.horizontalPosition = 'center';
          config.verticalPosition = 'top';

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

  onFormSubmit(form: NgForm): void {
    this.isValidFormSubmitted = true;

    if (!form.valid) {
      this.isValidFormSubmitted = false;
      return;
    }

    let search: Search = form.value;

    console.log(search);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  add(): void {
    this.router.navigateByUrl('employee/add');
  }

  edit(id: string) {
    this.router.navigateByUrl(`employee/edit/${id}`);
  }

  delete(element: any) {
    const dialogRef = this.dialog.open(DialogDataComponent, {
      data: {
        message: `Confirma a exclusão do funcionário ${element.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe( result => {
      if (result === true) {
        this.showSpinner = true;

        this.service.deleteEmployee(element.id)
          .subscribe({
            next: () => {
              this.dataSource = this.listEmployee.filter((value, key) => {
                return value.id != element.id;
              });

              this.snackBar.open(
                `Funcionário ${element.name} excluído com sucesso!`, "OK",
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
    });
  }

  resetSearchForm(form: NgForm): void {
    form.resetForm();
  }
}
