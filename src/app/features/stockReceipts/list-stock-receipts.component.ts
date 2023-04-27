import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { DialogData } from 'src/app/shared/dialog-data/dialog-data';
import { ListProductEntryHeader } from 'src/app/interfaces/listProductEntryHeader';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductEntryService } from 'src/app/services/product-entry.service';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-list-stock-receipts',
  templateUrl: './list-stock-receipts.component.html',
  styleUrls: ['./list-stock-receipts.component.css'],
})
export class ListStockReceiptsComponent implements OnInit {
  displayedColumns: string[] = ['code', 'employeeName', 'supplierName', 'transactionType', 'date',  'totalValue', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // dataSource: any; [3]
  dataSource!: MatTableDataSource<ListProductEntryHeader>;

  listProductEntryHeader: ListProductEntryHeader[] = [];
  dialogData!: DialogData;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  showSpinner = false;

  nextPageLabel = "Próxima página";
  previousPageLabel = "Página anterior";

  constructor(
    private service: ProductEntryService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.showSpinner = true;

    this.service.getListProductEntryHeader()
      .subscribe({
        next: (result) => {
          this.listProductEntryHeader = result;
          this.dataSource = new MatTableDataSource<ListProductEntryHeader>(this.listProductEntryHeader);
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  add(): void {
    this.router.navigateByUrl('stock-receipt/add');
  }

  details(id: string) {
    this.router.navigateByUrl(`stock-receipt/details/${id}`);
  }
}
