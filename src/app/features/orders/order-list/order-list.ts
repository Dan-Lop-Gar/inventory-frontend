import {
  Component, OnInit, OnDestroy, ViewChild, AfterViewInit, signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrderService } from '../services/order';
import { OrderStatusPipe } from '../../../shared/pipes/order-status';
import { Order, OrderStatus } from '../../../shared/interfaces/order';
import { AuthStore } from '../../../core/store/auth';
import { MatCardContent, MatCard } from "@angular/material/card";

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    OrderStatusPipe,
    MatCardContent,
    MatCard
],
  templateUrl: './order-list.html'
})
export class OrderListComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = [
    'orderNumber', 'supplierName', 'status',
    'totalAmount', 'createdBy', 'createdAt', 'actions'
  ];

  dataSource = new MatTableDataSource<Order>([]);
  statusControl = new FormControl<OrderStatus | ''>('');

  loading = signal(false);
  error = signal('');
  totalElements = signal(0);
  currentPage = signal(0);
  pageSize = signal(20);

  readonly statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'PENDING',   label: 'Pendiente' },
    { value: 'APPROVED',  label: 'Aprobada' },
    { value: 'RECEIVED',  label: 'Recibida' },
    { value: 'CANCELLED', label: 'Cancelada' },
    { value: 'FAILED',    label: 'Fallida' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private destroy$ = new Subject<void>();

  constructor(
    private orderService: OrderService,
    private router: Router,
    public authStore: AuthStore
  ) {}

  ngOnInit(): void {
    this.loadOrders();

    this.statusControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage.set(0);
        this.loadOrders();
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.error.set('');

    const status = this.statusControl.value || undefined;

    this.orderService.findAll({
      status: status as OrderStatus | undefined,
      page: this.currentPage(),
      size: this.pageSize(),
      sort: 'createdAt,desc'
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: response => {
        this.dataSource.data = response.content;
        this.totalElements.set(response.totalElements);
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
    this.loadOrders();
  }

  viewOrder(id: string): void {
    this.router.navigate(['/orders', id]);
  }

  createOrder(): void {
    this.router.navigate(['/orders/new']);
  }

  approve(id: string, event: Event): void {
    event.stopPropagation();
    this.orderService.approve(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: updated => {
          const idx = this.dataSource.data.findIndex(o => o.id === id);
          if (idx !== -1) {
            this.dataSource.data[idx] = updated;
            this.dataSource.data = [...this.dataSource.data];
          }
        },
        error: err => this.error.set(err.message)
      });
  }

  receive(id: string, event: Event): void {
    event.stopPropagation();
    this.orderService.receive(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: updated => {
          const idx = this.dataSource.data.findIndex(o => o.id === id);
          if (idx !== -1) {
            this.dataSource.data[idx] = updated;
            this.dataSource.data = [...this.dataSource.data];
          }
        },
        error: err => this.error.set(err.message)
      });
  }

  cancel(id: string, event: Event): void {
    event.stopPropagation();
    if (!confirm('¿Cancelar esta orden?')) return;

    this.orderService.cancel(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: updated => {
          const idx = this.dataSource.data.findIndex(o => o.id === id);
          if (idx !== -1) {
            this.dataSource.data[idx] = updated;
            this.dataSource.data = [...this.dataSource.data];
          }
        },
        error: err => this.error.set(err.message)
      });
  }

  statusColor(status: OrderStatus): string {
    return ({
      PENDING:   'warn',
      APPROVED:  'primary',
      RECEIVED:  'accent',
      CANCELLED: '',
      FAILED:    'warn'
    } as Record<OrderStatus, string>)[status] ?? '';
  }
}