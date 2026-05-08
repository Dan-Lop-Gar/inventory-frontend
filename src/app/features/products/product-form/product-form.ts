// src/app/features/products/product-form/product-form.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../services/product';
import { SupplierService } from '../../suppliers/services/supplier';
import { CategoryService } from '../services/category';
import { Supplier } from '../../../shared/interfaces/supplier';
import { Category } from '../../../shared/interfaces/category';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './product-form.html'
})
export class ProductFormComponent implements OnInit {

  saving = signal(false);
  error = signal('');
  categories = signal<Category[]>([]);
  suppliers = signal<Supplier[]>([]);

  form = new FormGroup({
    sku: new FormControl('', [
      Validators.required,
      Validators.maxLength(50)
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(200)
    ]),
    description: new FormControl(''),
    price: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0.01)
    ]),
    stockCurrent: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0)
    ]),
    stockMinimum: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0)
    ]),
    categoryId: new FormControl('', [Validators.required]),
    supplierId: new FormControl('', [Validators.required])
  });

  get skuCtrl()          { return this.form.get('sku')!; }
  get nameCtrl()         { return this.form.get('name')!; }
  get priceCtrl()        { return this.form.get('price')!; }
  get stockCurrentCtrl() { return this.form.get('stockCurrent')!; }
  get stockMinimumCtrl() { return this.form.get('stockMinimum')!; }
  get categoryIdCtrl()   { return this.form.get('categoryId')!; }
  get supplierIdCtrl()   { return this.form.get('supplierId')!; }

  constructor(
    private productService: ProductService,
    private supplierService: SupplierService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadSuppliers();
  }

  private loadCategories(): void {
    this.categoryService.findAll().subscribe({
      next: cats => this.categories.set(cats),
      error: err => this.error.set('Error cargando categorías: ' + err.message)
    });
  }

  private loadSuppliers(): void {
    this.supplierService.findAllActive().subscribe({
      next: sups => this.suppliers.set(sups),
      error: err => this.error.set('Error cargando proveedores: ' + err.message)
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set('');

    const request = {
      sku:          this.form.value.sku!,
      name:         this.form.value.name!,
      description:  this.form.value.description ?? undefined,
      price:        this.form.value.price!,
      stockCurrent: this.form.value.stockCurrent!,
      stockMinimum: this.form.value.stockMinimum!,
      categoryId:   this.form.value.categoryId!,
      supplierId:   this.form.value.supplierId!
    };

    this.productService.create(request).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/products']);
      },
      error: err => {
        this.saving.set(false);
        this.error.set(err.message);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}