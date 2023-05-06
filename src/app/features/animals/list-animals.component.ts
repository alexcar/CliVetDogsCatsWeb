import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { AnimalService } from 'src/app/services/animal.service';
import { DialogData } from 'src/app/shared/dialog-data/dialog-data';
import { DialogDataComponent } from 'src/app/shared/dialog-data/dialog-data.component';
import { ListAnimal } from 'src/app/interfaces/list-animal';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Search } from 'src/app/domain/search';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-list-animals',
  templateUrl: './list-animals.component.html',
  styleUrls: ['./list-animals.component.css']
})
export class ListAnimalsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'tutorName', 'species', 'race', 'coat', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  // dataSource: any;
  dataSource!: MatTableDataSource<ListAnimal>;

  isValidFormSubmitted = false;
  listAnimal: ListAnimal[] = [];
  dialogData!: DialogData;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  showSpinner = false;

  constructor(
    private service: AnimalService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog)
  {}

  ngOnInit(): void {
    this.showSpinner = true;

    this.service.getListAnimal()
      .subscribe({
        next: (result) => {
          this.listAnimal = result;
          this.dataSource = new MatTableDataSource<ListAnimal>(this.listAnimal)
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
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  add(): void {
    this.router.navigateByUrl('animal/add');
  }

  edit(id: string) {
    this.router.navigateByUrl(`animal/edit/${id}`);
  }

  delete(element: ListAnimal) {
    const dialogRef = this.dialog.open(DialogDataComponent, {
      data: {
        message: `Confirma a exclusão do animal ${element.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe( result => {
      if (result === true) {
        this.showSpinner = true;

        this.service.deleteAnimal(element.id)
          .subscribe({
            next: () => {

              // this.dataSource = this.listAnimal.filter((value, key) => {
              //   return value.id != element.id;
              // });

              this.listAnimal = this.listAnimal.filter((value, key) => {
                return value.id != element.id;
              });

              this.dataSource = new MatTableDataSource<ListAnimal>(this.listAnimal);
              this.dataSource.paginator = this.paginator;
              this.paginator._intl.itemsPerPageLabel = "Itens por página";
              this.paginator._intl.nextPageLabel = "Próxima página";
              this.paginator._intl.previousPageLabel = "Página anterior";

              this.snackBar.open(
                `Animal ${element.name} excluído com sucesso!`, "OK",
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
