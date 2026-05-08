import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product, CreateProductRequest, ProductFilter } from '../../../shared/interfaces/product'; 
import { PagedResponse } from '../../../shared/interfaces/page';

@Injectable({ providedIn: 'root' })
export class ProductService {

  // Productos van via Envoy (gRPC transcoded)
  private readonly grpcUrl = `${environment.apiGrpcUrl}/products`;

  constructor(private http: HttpClient) {}

  findAll(filter: ProductFilter = {}): Observable<PagedResponse<Product>> {
    let params = new HttpParams()
      .set('page', filter.page ?? 0)
      .set('size', filter.size ?? 20)
      //.set('sort', filter.sort ?? 'name,asc');

    if (filter.name) params = params.set('name', filter.name);
    if (filter.sku) params = params.set('sku', filter.sku);
    if (filter.categoryId) params = params.set('category_id', filter.categoryId);
    if (filter.belowMinimumStock !== undefined) {
      params = params.set('below_minimum_stock', filter.belowMinimumStock);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.get<PagedResponse<Product>>(this.grpcUrl, { headers, params })
      .pipe(catchError(this.handleError));
  }

  findById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.grpcUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(request: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.grpcUrl, request)
      .pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.grpcUrl}/${id}`
    ).pipe(catchError(this.handleError));
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.grpcUrl}/stats`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    const message = error.error?.detail ?? error.message ?? 'Error desconocido';
    return throwError(() => new Error(message));
  }
}