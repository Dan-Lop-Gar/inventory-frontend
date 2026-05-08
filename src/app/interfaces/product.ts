import { PageFilter } from "./page";

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  stockCurrent: number;
  stockMinimum: number;
  active: boolean;
  belowMinimumStock: boolean;
  categoryName: string;
  supplierName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  sku: string;
  name: string;
  description?: string;
  price: number;
  stockCurrent: number;
  stockMinimum: number;
  categoryId: string;
  supplierId: string;
}

export interface ProductFilter extends PageFilter {
  name?: string;
  sku?: string;
  categoryId?: string;
  supplierId?: string;
  minPrice?: number;
  maxPrice?: number;
  active?: boolean;
  belowMinimumStock?: boolean;
}