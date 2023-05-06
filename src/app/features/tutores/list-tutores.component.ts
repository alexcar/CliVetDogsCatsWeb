import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { DialogData } from 'src/app/shared/dialog-data/dialog-data';
import { DialogDataComponent } from 'src/app/shared/dialog-data/dialog-data.component';
import { ListTutor } from 'src/app/interfaces/list-tutor';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Search } from 'src/app/domain/search';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';
import { TutorService } from 'src/app/services/tutor.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-list-tutores',
  templateUrl: './list-tutores.component.html',
  styleUrls: ['./list-tutores.component.css']
})
export class ListTutoresComponent implements OnInit {
  displayedColumns: string[] = ['name', 'cpf', 'cellPhone', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  // dataSource: any;
  dataSource!: MatTableDataSource<ListTutor>;

  isValidFormSubmitted = false;
  listTutor: ListTutor[] = [];
  dialogData!: DialogData;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  showSpinner = false;

  constructor(
    private service: TutorService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.showSpinner = true;

    this.service.getListTutor()
      .subscribe({
        next: (result) => {
          this.listTutor = result;
          this.dataSource = new MatTableDataSource<ListTutor>(this.listTutor)
          this.dataSource.paginator = this.paginator;
          this.paginator._intl.itemsPerPageLabel = "Itens por página";
          this.paginator._intl.nextPageLabel = "Próxima página";
          this.paginator._intl.previousPageLabel = "Página anterior";
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

    // console.log(search);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  add(): void {
    this.router.navigateByUrl('tutor/add');
  }

  edit(id: string) {
    this.router.navigateByUrl(`tutor/edit/${id}`);
  }

  delete(element: ListTutor) {
    const dialogRef = this.dialog.open(DialogDataComponent, {
      data: {
        message: `Confirma a exclusão do tutor ${element.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe( result => {
      if (result === true) {
        this.showSpinner = true;

        this.service.deleteTutor(element.id)
          .subscribe({
            next: () => {
              // this.dataSource = this.listTutor.filter((value, key) => {
              //   return value.id != element.id;
              // });

              this.listTutor = this.listTutor.filter((value, key) => {
                return value.id != element.id;
              });

              this.dataSource = new MatTableDataSource<ListTutor>(this.listTutor);
              this.dataSource.paginator = this.paginator;
              this.paginator._intl.itemsPerPageLabel = "Itens por página";
              this.paginator._intl.nextPageLabel = "Próxima página";
              this.paginator._intl.previousPageLabel = "Página anterior";

              this.snackBar.open(
                `Tutor ${element.name} excluído com sucesso!`, "OK",
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
