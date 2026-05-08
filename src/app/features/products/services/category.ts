import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Category } from '../../../shared/interfaces/category';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private readonly apiUrl = `${environment.apiRestUrl}/categories`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl)
      .pipe(catchError(err => throwError(() => new Error(err.error?.detail ?? err.message))));
  }
}
