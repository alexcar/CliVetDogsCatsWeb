import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, delay, of, throwError } from 'rxjs';

import { Injectable } from '@angular/core';
import { ListSupplier } from '../interfaces/listSupplier';
import { Supplier } from '../domain/supplier';
import { SupplierReport } from '../interfaces/supplier-report';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private apiUrl = `${environment.apiUrl}suppliers`;
  supplier! : Supplier;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  environment: any;

  constructor(private http: HttpClient) { }

  getListSupplier(): Observable<ListSupplier[]> {
    return this.http.get<ListSupplier[]>(this.apiUrl)
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

  getSupplierById(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`)
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

  getReport(): Observable<SupplierReport[]> {
    return this.http.get<SupplierReport[]>(`${this.apiUrl}/report`)
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

  addSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier, this.httpOptions)
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

  updateSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(this.apiUrl, supplier, this.httpOptions)
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

  deleteSupplier(id: string): Observable<any> {
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
