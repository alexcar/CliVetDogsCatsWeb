import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { DialogData } from 'src/app/shared/dialog-data/dialog-data';
import { DialogDataComponent } from 'src/app/shared/dialog-data/dialog-data.component';
import { ListProductEntryHeader } from 'src/app/interfaces/listProductEntryHeader';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ProductEntryService } from 'src/app/services/product-entry.service';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-list-stock-receipts',
  templateUrl: './list-stock-receipts.component.html',
  styleUrls: ['./list-stock-receipts.component.css']
})
export class ListStockReceiptsComponent implements OnInit {
  displayedColumns: string[] = ['code', 'employee', 'supplier', 'date', 'transactionType', 'value'];
  dataSource: any;
  listProductEntryHeader: ListProductEntryHeader[] = [];
  dialogData!: DialogData;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  showSpinner = false;

  constructor(
    private service: ProductEntryService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.showSpinner = true;

    this.service.getListProductEntryHeader()
      .subscribe({
        next: (result) => {
          this.listProductEntryHeader = result;
          this.dataSource = new MatTableDataSource(this.listProductEntryHeader)
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  add(): void {
    this.router.navigateByUrl('stock-receipt/add');
  }

  // edit(id: string) {
  //   this.router.navigateByUrl(`stock-receipt/edit/${id}`);
  // }

  // delete(element: ListProductEntryHeader) {
  //   const dialogRef = this.dialog.open(DialogDataComponent, {
  //     data: {
  //       message: `Confirma a exclusão da Entrada de Produto ${element.code}?`,
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe( result => {
  //     if (result === true) {
  //       this.showSpinner = true;

  //       this.service.deleteProductEntry(element.id)
  //         .subscribe({
  //           next: () => {
  //             this.dataSource = this.listProductEntryHeader.filter((value, key) => {
  //               return value.id != element.id;
  //             });

  //             this.listProductEntryHeader = this.listProductEntryHeader.filter((value, key) => {
  //               return value.id != element.id;
  //             });

  //             this.dataSource = new MatTableDataSource(this.listProductEntryHeader)

  //             this.snackBar.open(
  //               `Entrada de Produto ${element.code} excluído com sucesso!`, "OK",
  //               {
  //                 horizontalPosition: 'center',
  //                 verticalPosition: 'top'
  //               });
  //           },
  //           error: (error) => {
  //             this.showSpinner = false;

  //             let duration: number = 5000;
  //             let errorMessages: string[] = [];
  //             errorMessages = error.message.split('|');

  //             if (errorMessages.length > 5) {
  //               duration = 10000;
  //             }

  //             let configError: MatSnackBarConfig = {
  //               panelClass: 'red-snackbar',
  //               duration: duration,
  //               horizontalPosition: 'center',
  //               verticalPosition: 'top'
  //             };

  //             this.snackBar.openFromComponent(SnackBarComponent, {
  //               data: error.message.split('|'),
  //               ...configError
  //             });

  //             return of([])
  //           },
  //           complete: () => {
  //             this.showSpinner = false;
  //           }
  //         });
  //     }
  //   });
  // }
}
