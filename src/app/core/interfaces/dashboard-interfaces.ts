export interface ProductStockAlert {
  productId: number;
  productName: string;
  stockQuantity: number;
}

export interface SaleSummary {
  saleId: number;
  clientName: string;
  saleDate: string;
  totalAmount: number;
}

export interface ClientSummary {
  clientId: number;
  clientName: string;
  registrationDate: string;
}

export interface DashboardSummaryDTO {
  totalSalesDay: number;
  totalSalesMonth: number;
  totalSalesYear: number;
  totalProductsInInventory: number;
  totalActiveClients: number;
  totalActiveEmployees: number;
  criticalStockProducts: ProductStockAlert[];
  recentSales: SaleSummary[];
  recentClients: ClientSummary[];
}
