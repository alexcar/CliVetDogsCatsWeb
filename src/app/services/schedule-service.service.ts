import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, delay, throwError } from 'rxjs';

import { Injectable } from '@angular/core';
import { ListScheduleService } from '../interfaces/list-schedule-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleServiceService {

  private apiUrl = `${environment.apiUrl}scheduleService`;
  scheduleService! : ListScheduleService;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  environment: any;

  constructor(private http: HttpClient) { }

  getListScheduleService(): Observable<ListScheduleService[]> {
    return this.http.get<ListScheduleService[]>(this.apiUrl)
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
