import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, delay, throwError } from 'rxjs';

import { Injectable } from '@angular/core';
import { ListProductEntryHeader } from '../interfaces/listProductEntryHeader';
import { Product } from '../domain/product';
import { ProductEntry } from '../domain/product-entry';
import { ProductEntryHeader } from '../domain/product-entry-header';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductEntryService {

  private apiUrl = `${environment.apiUrl}productEntries`;
  productEntry!: ProductEntry;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getListProductEntryHeader(): Observable<ListProductEntryHeader[]> {
    return this.http.get<ListProductEntryHeader[]>(this.apiUrl)
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

  getProductEntryHeaderById(id: string): Observable<ProductEntryHeader> {
    return this.http.get<ProductEntryHeader>(`${this.apiUrl}/${id}`)
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

  addProductEntry(productEntryHeader: ProductEntryHeader): Observable<ProductEntryHeader> {
    return this.http.post<ProductEntryHeader>(this.apiUrl, productEntryHeader, this.httpOptions)
      .pipe(
        catchError(error => {
          let errorMessages: string[] = [];

          if (error.error != undefined) {
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

  updateProductEntry(productEntryHeader: ProductEntryHeader): Observable<ProductEntryHeader> {
    return this.http.put<ProductEntryHeader>(this.apiUrl, productEntryHeader, this.httpOptions)
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

  deleteProductEntry(id: string): Observable<any> {
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
