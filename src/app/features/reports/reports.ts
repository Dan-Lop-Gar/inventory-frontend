// src/app/features/reports/reports.routes.ts
import { Routes } from '@angular/router';

export const reportRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./reports-dashboard/reports-dashboard')
        .then(m => m.ReportsDashboardComponent)
  }
];