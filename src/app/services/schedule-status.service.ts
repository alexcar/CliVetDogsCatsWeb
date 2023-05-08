import { Observable, catchError, delay, throwError } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListScheduleStatus } from '../interfaces/list-schedule-status';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleStatusService {

  private apiUrl = `${environment.apiUrl}scheduleStatus`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ListScheduleStatus[]> {
    return this.http.get<ListScheduleStatus[]>(this.apiUrl)
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
