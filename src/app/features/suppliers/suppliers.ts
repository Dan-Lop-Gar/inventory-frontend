import { Routes } from '@angular/router';

export const supplierRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./supplier-list/supplier-list')
        .then(m => m.SupplierListComponent)
  }
];