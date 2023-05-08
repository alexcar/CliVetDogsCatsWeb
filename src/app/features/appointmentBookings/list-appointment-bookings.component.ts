import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { DialogData } from 'src/app/shared/dialog-data/dialog-data';
import { ListSchedule } from 'src/app/interfaces/list-schedule';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ScheduleService } from 'src/app/services/schedule.service';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-list-appointment-bookings',
  templateUrl: './list-appointment-bookings.component.html',
  styleUrls: ['./list-appointment-bookings.component.css']
})
export class ListAppointmentBookingsComponent implements OnInit {

  displayedColumns: string[] = ['tutorName', 'animalName', 'vetName', 'scheduleDate', 'hour', 'status', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  // dataSource: any;
  dataSource!: MatTableDataSource<ListSchedule>;

  isValidFormSubmitted = false;
  listSchedule: ListSchedule[] = [];
  dialogData!: DialogData;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  showSpinner = false;

  constructor(
    private service: ScheduleService,
    private snackBar: MatSnackBar,
    private router: Router)
  {}

  ngOnInit(): void {
    this.showSpinner = true;

    this.service.getListSchedule()
      .subscribe({
        next: (result) => {
          this.listSchedule = result;
          this.dataSource = new MatTableDataSource<ListSchedule>(this.listSchedule)
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

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  add(): void {
    this.router.navigateByUrl('appointment-booking/add');
  }

  edit(id: string) {
    this.router.navigateByUrl(`appointment-booking/edit/${id}`);
    // this.router.navigateByUrl('appointment-booking/edit/fc736663-44f1-48c3-91ef-08db4d6ef34f');
  }
}
