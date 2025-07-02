import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Supplier } from '../interfaces/suppliers-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private baseUrl = 'http://localhost:8085/v1/api/supplier';

  constructor(private http: HttpClient) {}

  // Obtener todos los proveedores
  getAll(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.baseUrl}`);
  }

  // Obtener proveedores por estado ("A" o "I")
  getByStatus(status: 'A' | 'I'): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.baseUrl}/status/${status}`);
  }

  // Obtener proveedor por ID
  getById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.baseUrl}/${id}`);
  }

  // Crear nuevo proveedor
  create(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(`${this.baseUrl}/save`, supplier);
  }

  // Actualizar proveedor
  update(id: number, supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.baseUrl}/update/${id}`, supplier);
  }

  // Eliminar proveedor (soft delete)
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  // Restaurar proveedor eliminado
  restore(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/restore/${id}`, {});
  }
}
