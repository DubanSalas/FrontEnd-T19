export interface Product {
  idProduct: number;
  storeIdStore?: number;
  productName: string;
  description?: string;
  price: number;
  stock: number;
  status: string; // 'A' = activo, 'I' = inactivo
  type?: string;      // nuevo campo tipo (ej: "pan", "torta", "bocadito")
  image?: string;     // url o ruta de la imagen
}
