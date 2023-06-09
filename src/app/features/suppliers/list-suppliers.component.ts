import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { DialogData } from 'src/app/shared/dialog-data/dialog-data';
import { DialogDataComponent } from 'src/app/shared/dialog-data/dialog-data.component';
import { ListSupplier } from 'src/app/interfaces/listSupplier';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Search } from 'src/app/domain/search';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';
import { SupplierService } from 'src/app/services/supplier.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-list-suppliers',
  templateUrl: './list-suppliers.component.html',
  styleUrls: ['./list-suppliers.component.css']
})
export class ListSuppliersComponent implements OnInit {
  displayedColumns: string[] = ['trade', 'cnpj', 'contact', 'cellPhone', 'actions'];
  dataSource: any;
  isValidFormSubmitted = false;
  listSupplier: ListSupplier[] = [];
  dialogData!: DialogData;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  showSpinner = false;

  constructor(
    private service: SupplierService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.showSpinner = true;

    this.service.getListSupplier()
      .subscribe({
        next: (result) => {
          this.listSupplier = result;
          this.dataSource = new MatTableDataSource(this.listSupplier)
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
    this.router.navigateByUrl('supplier/add');
  }

  edit(id: string) {
    this.router.navigateByUrl(`supplier/edit/${id}`);
  }

  delete(element: ListSupplier) {
    const dialogRef = this.dialog.open(DialogDataComponent, {
      data: {
        message: `Confirma a exclusão do fornecedor ${element.trade}?`,
      },
    });

    dialogRef.afterClosed().subscribe( result => {
      if (result === true) {
        this.showSpinner = true;

        this.service.deleteSupplier(element.id)
          .subscribe({
            next: () => {
              this.dataSource = this.listSupplier.filter((value, key) => {
                return value.id != element.id;
              });

              this.snackBar.open(
                `Fornecedor ${element.trade} excluído com sucesso!`, "OK",
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

  report(): void {
    this.router.navigateByUrl('supplier/report');
  }

  resetSearchForm(form: NgForm): void {
    form.resetForm();
  }
}
