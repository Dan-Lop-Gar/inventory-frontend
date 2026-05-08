import {
  Component, OnInit, OnDestroy, ViewChild, AfterViewInit, signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StockService } from '../services/stock';
import { StockMovement } from '../../../shared/interfaces/stock';
import { MatCard, MatCardContent } from "@angular/material/card";

@Component({
  selector: 'app-stock-movements',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatCard,
    MatCardContent
],
  templateUrl: './stock-movements.html'
})
export class StockMovementsComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = [
    'productName', 'movementType', 'quantity',
    'stockBefore', 'stockAfter', 'createdBy', 'createdAt'
  ];

  dataSource = new MatTableDataSource<StockMovement>([]);
  loading = signal(false);
  error = signal('');
  totalElements = signal(0);
  currentPage = signal(0);
  pageSize = signal(20);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();

  constructor(private stockService: StockService) {}

  ngOnInit(): void { this.loadMovements(); }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMovements(): void {
    this.loading.set(true);
    this.stockService.listMovements({
      page: this.currentPage(),
      size: this.pageSize()
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: r => {
        this.dataSource.data = r.movements;
        this.totalElements.set(r.totalElements);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadMovements();
  }

  movementColor(type: string): string {
    return type.endsWith('_IN') ? 'primary' : 'warn';
  }
}