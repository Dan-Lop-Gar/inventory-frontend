import { Routes } from '@angular/router';

export const stockRoutes: Routes = [
  {
    path: '',
    redirectTo: 'movements',
    pathMatch: 'full'
  },
  {
    path: 'movements',
    loadComponent: () =>
      import('./stock-movements/stock-movements')
        .then(m => m.StockMovementsComponent)
  },
  {
    path: 'alerts',
    loadComponent: () =>
      import('./stock-alerts/stock-alerts')
        .then(m => m.StockAlertsComponent)
  }
];