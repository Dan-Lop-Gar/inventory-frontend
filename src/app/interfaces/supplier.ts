import { PageFilter } from "./page";

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierRequest {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  address?: string;
}

export interface SupplierFilter extends PageFilter {
  name?: string;
  country?: string;
  active?: boolean;
}