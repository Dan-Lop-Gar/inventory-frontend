import {
  Component, OnInit, OnDestroy, ViewChild, AfterViewInit, signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductService } from '../services/product';
import { StockStatusPipe } from '../../../shared/pipes/stock-status';
import { Product } from '../../../shared/interfaces/product';
import { AuthStore } from '../../../core/store/auth';
import { MatCard, MatCardContent } from "@angular/material/card";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    StockStatusPipe,
    MatCard,
    MatCardContent
],
  templateUrl: './product-list.html'
})
export class ProductListComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = [
    'sku', 'name', 'categoryName', 'supplierName',
    'price', 'stockCurrent', 'status', 'actions'
  ];

  dataSource = new MatTableDataSource<Product>([]);
  searchControl = new FormControl('');

  loading = signal(false);
  error = signal('');
  totalElements = signal(0);
  currentPage = signal(0);
  pageSize = signal(20);
  currentSort = signal('name,asc');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private router: Router,
    public authStore: AuthStore
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.setupSearch();
  }

  ngAfterViewInit(): void {
    //this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set('');

    const name = this.searchControl.value ?? undefined;

    this.productService.findAll({
      name: name || undefined,
      page: this.currentPage(),
      size: this.pageSize(),
      sort: this.currentSort()
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response: any) => {
        //console.log('Datos recibidos correctamente:', response.products);
      
        this.dataSource.data = response.products || [];
        this.totalElements.set(response.totalElements);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadProducts();
  }

  onSortChange(event: Sort): void {
    if (!event.active || event.direction === '') {
      this.currentSort.set('name,asc');
    } else {
      this.currentSort.set(`${event.active},${event.direction}`);
    }
    this.currentPage.set(0);
    this.loadProducts();
  }

  viewProduct(id: string): void {
    console.log('Navegando al producto con ID:', id); // Si esto sale como undefined, el problema es el nombre del campo
    if (id) {
      this.router.navigate(['/products', id]);
    } else {
      console.error('Error: El ID del producto no está definido');
    }
  }

  createProduct(): void {
    this.router.navigate(['/products/new']);
  }

  private setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage.set(0);
      this.loadProducts();
    });
  }
}