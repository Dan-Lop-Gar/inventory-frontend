import { PageFilter } from './page';

export type OrderStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'RECEIVED'
  | 'CANCELLED'
  | 'FAILED';

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  supplierName: string;
  supplierId: string;
  totalAmount: number;
  notes: string;
  createdBy: string;
  approvedBy: string;
  retryCount: number;
  lines: OrderLine[];
  createdAt: string;
  approvedAt: string;
  receivedAt: string;
}

export interface OrderLine {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateOrderRequest {
  supplierId: string;
  notes?: string;
  lines: CreateOrderLineRequest[];
}

export interface CreateOrderLineRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderFilter extends PageFilter {
  status?: OrderStatus;
  supplierId?: string;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
}