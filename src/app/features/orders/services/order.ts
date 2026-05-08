import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Order, CreateOrderRequest, OrderFilter
} from '../../../shared/interfaces/order';
import { PagedResponse } from '../../../shared/interfaces/page';

@Injectable({ providedIn: 'root' })
export class OrderService {

  // Órdenes van directo al backend REST
  private readonly apiUrl = `${environment.apiRestUrl}/orders`;

  constructor(private http: HttpClient) {}

  findAll(filter: OrderFilter = {}): Observable<PagedResponse<Order>> {
    let params = new HttpParams()
      .set('page', filter.page ?? 0)
      .set('size', filter.size ?? 20)
      .set('sort', filter.sort ?? 'createdAt,desc');

    if (filter.status)     params = params.set('status', filter.status);
    if (filter.supplierId) params = params.set('supplierId', filter.supplierId);
    if (filter.dateFrom)   params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo)     params = params.set('dateTo', filter.dateTo);

    return this.http.get<PagedResponse<Order>>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  findById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(request: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, request)
      .pipe(catchError(this.handleError));
  }

  approve(id: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/approve`, {})
      .pipe(catchError(this.handleError));
  }

  receive(id: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/receive`, {})
      .pipe(catchError(this.handleError));
  }

  cancel(id: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/cancel`, {})
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    const message = error.error?.detail ?? error.message ?? 'Error desconocido';
    return throwError(() => new Error(message));
  }
}
