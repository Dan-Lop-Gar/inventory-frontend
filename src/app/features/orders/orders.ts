import { Routes } from '@angular/router';

export const orderRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./order-list/order-list')
        .then(m => m.OrderListComponent)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./order-form/order-form')
        .then(m => m.OrderFormComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./order-detail/order-detail')
        .then(m => m.OrderDetailComponent)
  }
];