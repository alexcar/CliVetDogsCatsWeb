import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, delay, throwError } from 'rxjs';

import { Injectable } from '@angular/core';
import { ListTutor } from '../interfaces/list-tutor';
import { Tutor } from '../domain/tutor';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TutorService {

  private apiUrl = `${environment.apiUrl}tutors`;
  tutor! : Tutor;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  environment: any;

  constructor(private http: HttpClient) { }

  getListTutor(): Observable<ListTutor[]> {
    return this.http.get<ListTutor[]>(this.apiUrl)
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

  getTutorById(id: string): Observable<Tutor> {
    return this.http.get<Tutor>(`${this.apiUrl}/${id}`)
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

  GetAllTutorsHaveAnimal(): Observable<ListTutor[]> {
    return this.http.get<ListTutor[]>(`${this.apiUrl}/getAllTutorsHaveAnimal`)
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

  addTutor(tutor: Tutor): Observable<Tutor> {
    return this.http.post<Tutor>(this.apiUrl, tutor, this.httpOptions)
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

  updateTutor(tutor: Tutor): Observable<Tutor> {
    return this.http.put<Tutor>(this.apiUrl, tutor, this.httpOptions)
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

  deleteTutor(id: string): Observable<any> {
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
