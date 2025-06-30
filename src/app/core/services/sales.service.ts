import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sale } from '../interfaces/sales-interfaces';
import { Customer } from '../interfaces/customer-interfaces';
import { Employee } from '../interfaces/employees-interfaces';
import { Product } from '../interfaces/products-interfaces'; // IMPORTACIÓN NUEVA
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private http = inject(HttpClient);
  private readonly url = `${environment.urlBackEnd}/v1/api/sales`;

  // Obtener todas las ventas
  getAll(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.url);
  }

  // Guardar una venta
  save(sale: Sale): Observable<Sale> {
    return this.http.post<Sale>(this.url, sale);
  }

  // Actualizar la venta completa
  update(id: number, sale: Sale): Observable<Sale> {
    return this.http.put<Sale>(`${this.url}/${id}`, sale);
  }

  // Actualizar solo la información de la venta
  updateInfo(id: number, sale: Sale): Observable<Sale> {
    return this.http.put<Sale>(`${this.url}/${id}/info`, sale);
  }

  // Obtener detalles de la venta
  getDetails(idSale: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${idSale}/details`);
  }

  // Obtener todos los clientes
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${environment.urlBackEnd}/v1/api/customers`);
  }

  // Obtener todos los empleados
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${environment.urlBackEnd}/v1/api/employees`);
  }

  // ✅ NUEVO: Obtener todos los productos
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.urlBackEnd}/v1/api/products`);
  }
}
