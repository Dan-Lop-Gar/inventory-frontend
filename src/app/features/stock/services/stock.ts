// src/app/features/stock/services/stock.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StockMovement, StockLevel } from '../../../shared/interfaces/stock';

export interface StockMovementsResponse {
  movements: StockMovement[];
  totalElements: number;
  totalPages: number;
}

export interface MovementsFilter {
  productId?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class StockService {

  // Stock va via Envoy (gRPC transcoded)
  private readonly grpcUrl = `${environment.apiGrpcUrl}/stock`;

  constructor(private http: HttpClient) {}

  getStockLevel(productId: string): Observable<StockLevel> {
    return this.http.get<StockLevel>(`${this.grpcUrl}/${productId}`)
      .pipe(catchError(err => throwError(() => new Error(err.error?.detail ?? err.message))));
  }

  listMovements(filter: MovementsFilter = {}): Observable<StockMovementsResponse> {
    let params = new HttpParams()
      .set('page', filter.page ?? 0)
      .set('size', filter.size ?? 20);

    if (filter.productId) params = params.set('product_id', filter.productId);

    return this.http.get<StockMovementsResponse>(
      `${this.grpcUrl}/movements`, { params }
    ).pipe(catchError(err => throwError(() => new Error(err.error?.detail ?? err.message))));
  }
}