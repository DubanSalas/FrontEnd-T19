export interface Product {
  idProduct: number;
  productName: string;
  description?: string;
  price: number;
  stock: number;
  expirationDate: string; // Fecha de expiración en formato 'YYYY-MM-DD'
  status: string; // 'A' = activo, 'I' = inactivo
  type?: string; // Tipo de producto (ejemplo: 'Pan', 'Torta', 'Bocadito')
}
