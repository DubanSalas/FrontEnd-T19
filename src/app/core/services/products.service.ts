import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/products-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8085/v1/api/product';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductsByStatus(status: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/status/${status}`);
  }

  getProductsByStatusAndType(status: string, type: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/status/${status}/type/${type}`);
  }

  updateProduct(productData: FormData, id: number): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/update/${id}`, productData);
  }

  createProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/save`, productData);
  }

  checkNameExists(productName: string): Observable<boolean> {
    const params = new HttpParams().set('productName', productName);
    return this.http.get<boolean>(`${this.apiUrl}/exists`, { params });
  }

  // NUEVO: Generar reporte PDF
  reportPdf(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf`, { responseType: 'blob' });
  }
}
