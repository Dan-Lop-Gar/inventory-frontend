import { PageFilter } from './page';

export type MovementType =
  | 'PURCHASE_IN'
  | 'SALE_OUT'
  | 'ADJUSTMENT_IN'
  | 'ADJUSTMENT_OUT'
  | 'RETURN_IN';

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  movementType: MovementType;
  inbound: boolean;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  referenceId: string;
  referenceType: string;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export interface StockLevel {
  productId: string;
  productName: string;
  sku: string;
  stockCurrent: number;
  stockMinimum: number;
  belowMinimum: boolean;
}

export interface StockFilter extends PageFilter {
  productId?: string;
  movementType?: MovementType;
}