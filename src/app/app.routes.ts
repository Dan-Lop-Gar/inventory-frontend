import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth'; 
import { roleGuard } from './core/guards/role';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/products/products')
        .then(m => m.productRoutes)
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/orders/orders')
        .then(m => m.orderRoutes)
  },
  {
    path: 'suppliers',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/suppliers/suppliers')
        .then(m => m.supplierRoutes)
  },
  {
    path: 'stock',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/stock/stock')
        .then(m => m.stockRoutes)
  },
  {
    path: 'reports',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'AUDITOR', 'WAREHOUSE'] },
    loadChildren: () =>
      import('./features/reports/reports')
        .then(m => m.reportRoutes)
  },
  {
    path: '**',
    redirectTo: 'products'
  }
];