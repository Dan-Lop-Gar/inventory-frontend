export interface StockStatsResponse {
  totalProducts: number;
  productsAboveMinimum: number;
  productsBelowMinimum: number;
  byCategory: CategoryStockStat[];
}

export interface CategoryStockStat {
  category: string;
  totalProducts: number;
  totalStock: number;
  avgPrice: number;
}

export interface SalesReportResponse {
  dateFrom: string;
  dateTo: string;
  totalAmount: number;
  totalOrders: number;
  dailyStats: DailyOrderStat[];
  topProducts: TopProductStat[];
}

export interface DailyOrderStat {
  date: string;
  ordersCount: number;
  amount: number;
}

export interface TopProductStat {
  productName: string;
  sku: string;
  totalQuantity: number;
  totalAmount: number;
}