import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { AnimalReport } from 'src/app/interfaces/animal-report';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';
import { TutorReport } from 'src/app/interfaces/tutor-report';
import { TutorService } from 'src/app/services/tutor.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { of } from 'rxjs';

@Component({
  selector: 'app-tutor-report',
  templateUrl: './tutor-report.component.html',
  styleUrls: ['./tutor-report.component.css']
})
export class TutorReportComponent implements OnInit {
  showSpinner = false;
  displayedColumnsPDF: string[] = ['name', 'cpf', 'email', 'cellPhone'];
  dataSource: any;
  employeeReport: TutorReport[] = [];

  constructor(
    private service: TutorService,
    private router: Router,
    private snackBar: MatSnackBar,) {}

  ngOnInit(): void {
    this.showReport();
  }

  showReport(): void {
    this.showSpinner = true;

    this.service.getReport().subscribe({
      next: (result) => {
        this.employeeReport = result;
          this.dataSource = new MatTableDataSource(this.employeeReport)
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

  displayAnimals(animals: AnimalReport[]): string {
    let animalsList = 'Animal: ';

    if (animals.length > 1) {
      animalsList = 'Animais: ';
    }

    animals.forEach(element => {
      animalsList += ` ${element.name}, `
    });

    animalsList = animalsList.substring(0, animalsList.length - 2);

    return animalsList;
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
      pdf.save('tutor.pdf');
    });
  }

  cancelReport(): void {
    this.router.navigateByUrl('list-tutors');
  }
}
