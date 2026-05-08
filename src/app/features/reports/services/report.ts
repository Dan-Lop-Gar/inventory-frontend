import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  StockStatsResponse, SalesReportResponse
} from '../../../shared/interfaces/report';
import { Product } from '../../../shared/interfaces/product';

@Injectable({ providedIn: 'root' })
export class ReportService {

  private readonly apiUrl = `${environment.apiRestUrl}/reports`;

  constructor(private http: HttpClient) {}

  getStockStats(): Observable<StockStatsResponse> {
    return this.http.get<StockStatsResponse>(`${this.apiUrl}/stock-stats`)
      .pipe(catchError(this.handleError));
  }

  getSalesReport(dateFrom: string, dateTo: string): Observable<SalesReportResponse> {
    const params = new HttpParams()
      .set('dateFrom', dateFrom)
      .set('dateTo', dateTo);

    return this.http.get<SalesReportResponse>(`${this.apiUrl}/sales`, { params })
      .pipe(catchError(this.handleError));
  }

  getStockAlerts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/stock-alerts`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    return throwError(() => new Error(error.error?.detail ?? error.message));
  }
}