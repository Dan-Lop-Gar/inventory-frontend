import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormGroup, FormControl,
  FormArray, Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { OrderService } from '../services/order';
import { SupplierService } from '../../suppliers/services/supplier';
import { ProductService } from '../../products/services/product';
import { Supplier } from '../../../shared/interfaces/supplier';
import { Product } from '../../../shared/interfaces/product';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule
  ],
  templateUrl: './order-form.html'
})
export class OrderFormComponent implements OnInit {

  saving = signal(false);
  error = signal('');
  suppliers = signal<Supplier[]>([]);
  products = signal<Product[]>([]);

  linesColumns = ['product', 'quantity', 'unitPrice', 'total', 'remove'];

  form = new FormGroup({
    supplierId: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
    lines: new FormArray<FormGroup>([], [Validators.minLength(1)])
  });

  get supplierId() { return this.form.get('supplierId')!; }
  get lines()      { return this.form.get('lines') as FormArray; }

  constructor(
    private orderService: OrderService,
    private supplierService: SupplierService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.supplierService.findAllActive().subscribe(s => this.suppliers.set(s));
    this.productService.findAll({ size: 200 }).subscribe(
      r => this.products.set(r.content)
    );
    this.addLine(); // inicia con una línea
  }

  addLine(): void {
    this.lines.push(new FormGroup({
      productId: new FormControl('', [Validators.required]),
      quantity:  new FormControl<number | null>(null, [
        Validators.required, Validators.min(1)
      ]),
      unitPrice: new FormControl<number | null>(null, [
        Validators.required, Validators.min(0.01)
      ])
    }));
  }

  removeLine(index: number): void {
    if (this.lines.length > 1) this.lines.removeAt(index);
  }

  lineTotal(index: number): number {
    const line = this.lines.at(index);
    const qty   = line.get('quantity')?.value ?? 0;
    const price = line.get('unitPrice')?.value ?? 0;
    return qty * price;
  }

  get orderTotal(): number {
    return this.lines.controls.reduce((sum, _, i) => sum + this.lineTotal(i), 0);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set('');

    const request = {
      supplierId: this.form.value.supplierId!,
      notes:      this.form.value.notes ?? undefined,
      lines: this.lines.value.map((l: any) => ({
        productId: l.productId,
        quantity:  l.quantity,
        unitPrice: l.unitPrice
      }))
    };

    this.orderService.create(request).subscribe({
      next: order => {
        this.saving.set(false);
        this.router.navigate(['/orders', order.id]);
      },
      error: err => {
        this.saving.set(false);
        this.error.set(err.message);
      }
    });
  }

  cancel(): void { this.router.navigate(['/orders']); }

  productName(productId: string): string {
    return this.products().find(p => p.id === productId)?.name ?? '';
  }
}