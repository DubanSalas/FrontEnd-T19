export interface SaleDetail {
  idSaleDetail?: number; // Optional field, it's auto-generated
  idProduct: number;     // The ID of the product being sold
  amount: number;        // Quantity of the product
  price: number;         // Price of the product
  total: number;         // Total price for the product (amount * price)
}

export interface Sale {
  idSales?: number;      // Optional field, the sale ID, auto-generated
  idEmployee: number;    // ID of the employee who handled the sale
  idCustomer: number;    // ID of the customer making the purchase
  saleDate: string;      // The date the sale was made (yyyy-mm-dd)
  total: number;         // Total amount of the sale (sum of all sale details)
  paymentMethod: string; // Method of payment (e.g., "Efectivo", "Yape", "Tarjeta")
  details: SaleDetail[]; // List of sale details (products sold in the sale)
}
