import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '../store/auth';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          authStore.login();
          break;
        case 403:
          router.navigate(['/products']);
          console.error('Sin permisos para esta acción');
          break;
        case 0:
          console.error('Sin conexión al servidor');
          break;
        default:
          console.error(`Error ${error.status}:`, error.message);
      }
      return throwError(() => error);
    })
  );
};