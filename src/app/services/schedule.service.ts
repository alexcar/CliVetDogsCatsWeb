import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, delay, throwError } from 'rxjs';

import { Injectable } from '@angular/core';
import { ListSchedule } from '../interfaces/list-schedule';
import { Schedule } from '../domain/schedule';
import { ScheduleCancellation } from '../interfaces/schedule-cancellation';
import { ScheduleEnd } from '../interfaces/schedule-end';
import { ScheduleStart } from '../interfaces/schedule-start';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private apiUrl = `${environment.apiUrl}schedules`;
  schedule! : Schedule;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  environment: any;

  constructor(private http: HttpClient) { }

  getListSchedule(): Observable<ListSchedule[]> {
    return this.http.get<ListSchedule[]>(this.apiUrl)
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

  getScheduleById(id: string): Observable<Schedule> {
    return this.http.get<Schedule>(`${this.apiUrl}/${id}`)
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

  addSchedule(schedule: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>(this.apiUrl, schedule, this.httpOptions)
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

  updateSchedule(schedule: Schedule): Observable<any> {
    return this.http.put<Schedule>(this.apiUrl, schedule, this.httpOptions)
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

  scheduleStart(scheduleStart: ScheduleStart): Observable<any> {
    return this.http.post<ScheduleStart>(this.apiUrl, scheduleStart, this.httpOptions)
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

  scheduleEnd(scheduleEnd: ScheduleEnd): Observable<any> {
    return this.http.post<ScheduleEnd>(this.apiUrl, scheduleEnd, this.httpOptions)
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

  scheduleCancellation(scheduleCancellation: ScheduleCancellation): Observable<any> {
    return this.http.post<ScheduleEnd>(this.apiUrl, scheduleCancellation, this.httpOptions)
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
