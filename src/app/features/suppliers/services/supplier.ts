// src/app/features/suppliers/services/supplier.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Supplier, CreateSupplierRequest, SupplierFilter
} from '../../../shared/interfaces/supplier';
import { PagedResponse } from '../../../shared/interfaces/page';

@Injectable({ providedIn: 'root' })
export class SupplierService {

  private readonly apiUrl = `${environment.apiRestUrl}/suppliers`;

  constructor(private http: HttpClient) {}

  findAll(filter: SupplierFilter = {}): Observable<PagedResponse<Supplier>> {
    let params = new HttpParams()
      .set('page', filter.page ?? 0)
      .set('size', filter.size ?? 20)
      .set('sort', filter.sort ?? 'name,asc');

    if (filter.name)    params = params.set('name', filter.name);
    if (filter.country) params = params.set('country', filter.country);

    return this.http.get<PagedResponse<Supplier>>(this.apiUrl, { params })
      .pipe(catchError(err => throwError(() => new Error(err.error?.detail ?? err.message))));
  }

  // Para los selects del formulario de producto/orden
  findAllActive(): Observable<Supplier[]> {
  const params = new HttpParams()
    .set('size', 10)
    .set('active', true);

  return this.http.get<PagedResponse<Supplier>>(this.apiUrl, { params }).pipe(
    map(response => response.content),
    catchError(err => throwError(() => new Error(err.error?.detail ?? err.message)))
  );
}

  findById(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`)
      .pipe(catchError(err => throwError(() => new Error(err.error?.detail ?? err.message))));
  }

  create(request: CreateSupplierRequest): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, request)
      .pipe(catchError(err => throwError(() => new Error(err.error?.detail ?? err.message))));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(err => throwError(() => new Error(err.error?.detail ?? err.message))));
  }
}