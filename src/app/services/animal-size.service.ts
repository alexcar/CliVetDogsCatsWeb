import { Observable, catchError, delay, throwError } from 'rxjs';

import { AnimalSize } from '../domain/animalSize';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnimalSizeService {
  private apiUrl = `${environment.apiUrl}animalSizes`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<AnimalSize[]> {
    return this.http.get<AnimalSize[]>(this.apiUrl)
      .pipe(delay(2000),
        catchError(error => {
          let errorMessages: string[] = [];

          if (error.error !== undefined) {
            error.error.forEach((item: any) => {
              errorMessages.push(item.message);
            });
          } else {
            errorMessages.push(error.message);
          }

          return throwError(() => new Error(errorMessages.join('|')));
        })
      );
  }
}
