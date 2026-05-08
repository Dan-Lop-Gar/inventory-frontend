import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { OrderService } from '../services/order';
import { OrderStatusPipe } from '../../../shared/pipes/order-status';
import { Order } from '../../../shared/interfaces/order';
import { AuthStore } from '../../../core/store/auth';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    OrderStatusPipe
  ],
  templateUrl: './order-detail.html'
})
export class OrderDetailComponent implements OnInit {

  order = signal<Order | null>(null);
  loading = signal(true);
  error = signal('');
  actionLoading = signal(false);

  linesColumns = ['productName', 'productSku', 'quantity', 'unitPrice', 'totalPrice'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    public authStore: AuthStore
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/orders']); return; }

    this.orderService.findById(id).subscribe({
      next: o => {
        this.order.set(o);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  approve(): void {
    if (!this.order()) return;
    this.actionLoading.set(true);
    this.orderService.approve(this.order()!.id).subscribe({
      next: updated => {
        this.order.set(updated);
        this.actionLoading.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.actionLoading.set(false);
      }
    });
  }

  receive(): void {
    if (!this.order()) return;
    this.actionLoading.set(true);
    this.orderService.receive(this.order()!.id).subscribe({
      next: updated => {
        this.order.set(updated);
        this.actionLoading.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.actionLoading.set(false);
      }
    });
  }

  cancel(): void {
    if (!this.order() || !confirm('¿Cancelar esta orden?')) return;
    this.actionLoading.set(true);
    this.orderService.cancel(this.order()!.id).subscribe({
      next: updated => {
        this.order.set(updated);
        this.actionLoading.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.actionLoading.set(false);
      }
    });
  }

  goBack(): void { this.router.navigate(['/orders']); }
}
