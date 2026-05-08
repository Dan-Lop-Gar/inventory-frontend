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
import { MatTooltipModule } from '@angular/material/tooltip';
import { SupplierService } from '../services/supplier';
import { Supplier } from '../../../shared/interfaces/supplier';
import { AuthStore } from '../../../core/store/auth';
import { MatCardContent, MatCard } from "@angular/material/card";

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCardContent,
    MatCard
],
  templateUrl: './supplier-list.html'
})
export class SupplierListComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ['name', 'email', 'phone', 'country', 'active', 'actions'];
  dataSource = new MatTableDataSource<Supplier>([]);

  loading = signal(false);
  error = signal('');
  totalElements = signal(0);
  currentPage = signal(0);
  pageSize = signal(20);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();

  constructor(
    private supplierService: SupplierService,
    public authStore: AuthStore
  ) {}

  ngOnInit(): void { this.loadSuppliers(); }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSuppliers(): void {
    this.loading.set(true);
    this.supplierService.findAll({
      page: this.currentPage(),
      size: this.pageSize()
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: r => {
        this.dataSource.data = r.content;
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
    this.loadSuppliers();
  }

  delete(id: string): void {
    if (!confirm('¿Desactivar este proveedor?')) return;
    this.supplierService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadSuppliers(),
        error: err => this.error.set(err.message)
      });
  }
}