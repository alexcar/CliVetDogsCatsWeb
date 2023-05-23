import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { AnimalReport } from 'src/app/interfaces/animal-report';
import { AnimalService } from 'src/app/services/animal.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { of } from 'rxjs';

@Component({
  selector: 'app-animal-report',
  templateUrl: './animal-report.component.html',
  styleUrls: ['./animal-report.component.css']
})
export class AnimalReportComponent implements OnInit {
  showSpinner = false;
  displayedColumnsPDF: string[] = ['name', 'tutorName', 'sexo', 'birthDate', 'species', 'race', 'coat'];
  dataSource: any;
  animalReport: AnimalReport[] = [];

  constructor(
    private service: AnimalService,
    private router: Router,
    private snackBar: MatSnackBar,) {}


  ngOnInit(): void {
    this.showReport();
  }

  showReport(): void {
    this.showSpinner = true;

    this.service.getReport().subscribe({
      next: (result) => {
        this.animalReport = result;
          this.dataSource = new MatTableDataSource(this.animalReport)
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
    })
  }

  downloadPDF(): void {
    // https://www.positronx.io/angular-pdf-tutorial-export-pdf-in-angular-with-jspdf/
    const htmlData: any = document.getElementById('htmlData');

    html2canvas(htmlData).then((canvas) => {
      const fileWidth = 208;
      const fileheight = (canvas.height * fileWidth) / canvas.width;
      const fileUri = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(fileUri, 'PNG', 0, position, fileWidth, fileheight);
      pdf.save('animal.pdf');
    });
  }

  cancelReport(): void {
    this.router.navigateByUrl('list-animals');
  }

}
