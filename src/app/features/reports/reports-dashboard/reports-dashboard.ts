import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart, CategoryScale, LinearScale, BarElement,
  ArcElement, LineElement, PointElement, Title, Tooltip, Legend,
  BarController, LineController, DoughnutController, Filler
} from 'chart.js';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input'; // <-- AGREGAR ESTA LÍNE
import { ReportService } from '../services/report';

Chart.register(
  CategoryScale, LinearScale, BarElement,
  ArcElement, LineElement, PointElement,
  Title, Tooltip, Legend,
  BarController, LineController, DoughnutController, Filler
);

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseChartDirective,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reports-dashboard.html',
  styleUrl: './reports-dashboard.scss'
})
export class ReportsDashboardComponent implements OnInit {

  loading = signal(false);
  error = signal('');

  dateFrom = new FormControl(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  dateTo = new FormControl(new Date());

  // ── Gráfica de barras — stock por categoría ──
  barChartType: ChartType = 'bar';
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Stock total',
        data: [],
        backgroundColor: 'rgba(63, 81, 181, 0.7)',
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 1
      },
      {
        label: 'Productos',
        data: [],
        backgroundColor: 'rgba(255, 152, 0, 0.7)',
        borderColor: 'rgba(255, 152, 0, 1)',
        borderWidth: 1
      }
    ]
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Stock por Categoría' },
      legend: { position: 'top' }
    },
    scales: { y: { beginAtZero: true } }
  };

  // ── Gráfica de pie — stock normal vs bajo mínimo ──
  pieChartType: ChartType = 'doughnut';
  pieChartData: ChartData<'doughnut'> = {
    labels: ['Stock normal', 'Stock bajo mínimo'],
    datasets: [{
      data: [0, 0],
      backgroundColor: [
        'rgba(76, 175, 80, 0.8)',
        'rgba(244, 67, 54, 0.8)'
      ]
    }]
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Estado del Stock' },
      legend: { position: 'right' }
    }
  };

  // ── Gráfica de líneas — órdenes diarias ──
  lineChartType: ChartType = 'line';
  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      label: 'Movimientos diarios',
      data: [],
      borderColor: 'rgba(63, 81, 181, 1)',
      backgroundColor: 'rgba(63, 81, 181, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Movimientos de Stock por Día' },
      legend: { position: 'top' }
    }
  };

  // Stats resumen
  totalProducts = signal(0);
  productsOk = signal(0);
  productsBelowMin = signal(0);

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadStockStats();
    this.loadSalesReport();
  }

  loadStockStats(): void {
    this.loading.set(true);

    this.reportService.getStockStats().subscribe({
      next: (stats) => {
        this.totalProducts.set(stats.totalProducts);
        this.productsOk.set(stats.productsAboveMinimum);
        this.productsBelowMin.set(stats.productsBelowMinimum);

        // Actualiza gráfica de barras
        this.barChartData = {
          ...this.barChartData,
          labels: stats.byCategory.map(c => c.category),
          datasets: [
            {
              ...this.barChartData.datasets[0],
              data: stats.byCategory.map(c => c.totalStock)
            },
            {
              ...this.barChartData.datasets[1],
              data: stats.byCategory.map(c => c.totalProducts)
            }
          ]
        };

        // Actualiza gráfica de pie
        this.pieChartData = {
          ...this.pieChartData,
          datasets: [{
            ...this.pieChartData.datasets[0],
            data: [stats.productsAboveMinimum, stats.productsBelowMinimum]
          }]
        };

        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  loadSalesReport(): void {
    const from = this.dateFrom.value?.toISOString().split('T')[0] ?? '';
    const to = this.dateTo.value?.toISOString().split('T')[0] ?? '';

    this.reportService.getSalesReport(from, to).subscribe({
      next: (report) => {
        this.lineChartData = {
          ...this.lineChartData,
          labels: report.dailyStats.map(d => d.date),
          datasets: [{
            ...this.lineChartData.datasets[0],
            data: report.dailyStats.map(d => d.ordersCount)
          }]
        };
      },
      error: (err) => console.error('Error cargando reporte:', err)
    });
  }

  onDateRangeChange(): void {
    this.loadSalesReport();
  }
}