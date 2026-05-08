// src/app/features/stock/stock-alerts/stock-alerts.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReportService } from '../../reports/services/report';
import { Product } from '../../../shared/interfaces/product';
import { MatCardContent, MatCard } from "@angular/material/card";

@Component({
  selector: 'app-stock-alerts',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatCardContent,
    MatCard
],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>
          <mat-icon style="color:#c62828;vertical-align:middle">warning</mat-icon>
          Alertas de Stock Bajo
        </h2>
        <button mat-stroked-button (click)="load()">
          <mat-icon>refresh</mat-icon> Actualizar
        </button>
      </div>

      @if (error()) { <div class="alert-error">{{ error() }}</div> }

      <mat-card>
        <mat-card-content>
          @if (loading()) {
            <div class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          } @else {
            <table mat-table [dataSource]="dataSource" class="w-full">

              <ng-container matColumnDef="sku">
                <th mat-header-cell *matHeaderCellDef>SKU</th>
                <td mat-cell *matCellDef="let p"><code>{{ p.sku }}</code></td>
              </ng-container>

              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Producto</th>
                <td mat-cell *matCellDef="let p">{{ p.name }}</td>
              </ng-container>

              <ng-container matColumnDef="categoryName">
                <th mat-header-cell *matHeaderCellDef>Categoría</th>
                <td mat-cell *matCellDef="let p">{{ p.categoryName }}</td>
              </ng-container>

              <ng-container matColumnDef="stockCurrent">
                <th mat-header-cell *matHeaderCellDef>Stock actual</th>
                <td mat-cell *matCellDef="let p">
                  <span class="stock-low">{{ p.stockCurrent }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="stockMinimum">
                <th mat-header-cell *matHeaderCellDef>Stock mínimo</th>
                <td mat-cell *matCellDef="let p">{{ p.stockMinimum }}</td>
              </ng-container>

              <ng-container matColumnDef="supplierName">
                <th mat-header-cell *matHeaderCellDef>Proveedor</th>
                <td mat-cell *matCellDef="let p">{{ p.supplierName }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                  style="background: #fff8f8">
              </tr>

              <tr *matNoDataRow>
                <td [colSpan]="displayedColumns.length" class="no-data"
                    style="color:#2e7d32">
                  ✓ Todos los productos tienen stock suficiente
                </td>
              </tr>
            </table>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class StockAlertsComponent implements OnInit {

  displayedColumns = [
    'sku', 'name', 'categoryName',
    'stockCurrent', 'stockMinimum', 'supplierName'
  ];

  dataSource = new MatTableDataSource<Product>([]);
  loading = signal(false);
  error = signal('');

  constructor(private reportService: ReportService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.reportService.getStockAlerts().subscribe({
      next: products => {
        this.dataSource.data = products;
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
}