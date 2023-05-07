import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, delay, throwError } from 'rxjs';

import { Animal } from '../domain/animal';
import { Injectable } from '@angular/core';
import { ListAnimal } from '../interfaces/list-animal';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {

  private apiUrl = `${environment.apiUrl}animals`;
  animal! : Animal;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  environment: any;

  constructor(private http: HttpClient) { }

  getListAnimal(): Observable<ListAnimal[]> {
    return this.http.get<ListAnimal[]>(this.apiUrl)
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

  getAnimalById(id: string): Observable<Animal> {
    return this.http.get<Animal>(`${this.apiUrl}/${id}`)
      .pipe(delay(2000),
        catchError(err => {
          let errorMessages: string[] = [];

          if (err.error !== undefined) {
            err.error.forEach((item: any) => {
              errorMessages.push(item.message);
            });
          } else {
            errorMessages.push(err.message);
          }

          return throwError(() => new Error(errorMessages.join('|')));
        })
      );
  }

  getByTutorId(id: string): Observable<ListAnimal[]> {
    return this.http.get<ListAnimal[]>(`${this.apiUrl}/getByTutor/${id}`)
      .pipe(delay(2000),
        catchError(err => {
          let errorMessages: string[] = [];

          if (err.error !== undefined) {
            err.error.forEach((item: any) => {
              errorMessages.push(item.message);
            });
          } else {
            errorMessages.push(err.message);
          }

          return throwError(() => new Error(errorMessages.join('|')));
        })
      );
  }

  addAnimal(animal: Animal): Observable<Animal> {
    return this.http.post<Animal>(this.apiUrl, animal, this.httpOptions)
      .pipe(
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

  updateAnimal(animal: Animal): Observable<Animal> {
    return this.http.put<Animal>(this.apiUrl, animal, this.httpOptions)
      .pipe(
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

  deleteAnimal(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.httpOptions)
    .pipe(
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
