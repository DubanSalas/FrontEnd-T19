import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../interfaces/customer-interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.urlBackEnd}/v1/api/customer`; // Asegúrate de que 'urlBackEnd' apunte al backend

  constructor(private http: HttpClient) {}

  // Obtener clientes por estado (activos o inactivos)
  findByState(state: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/status/${state}`);
  }

  // Obtener todos los clientes
  findAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  // Obtener un cliente por ID
  findById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  // Establecer el cliente seleccionado para edición
  setSelectedCustomer(customer: Customer): void {
    localStorage.setItem('selectedCustomer', JSON.stringify(customer));
  }

  // Obtener el cliente seleccionado desde el almacenamiento local
  getSelectedCustomer(): Customer | null {
    const customerData = localStorage.getItem('selectedCustomer');
    return customerData ? JSON.parse(customerData) : null;  // Si no se encuentra el cliente, retorna null
  }

  // Eliminar un cliente por ID (marcar como inactivo)
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // Restaurar un cliente (marcar como activo)
  restore(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/restore/${id}`, null);  // Llamada al endpoint para restaurar
  }

  // Actualizar el estado de un cliente (activo o inactivo)
  updateStatus(id: number, status: string): Observable<Customer> {
    return this.http.patch<Customer>(`${this.apiUrl}/update/${id}`, { status });
  }

  // Guardar un nuevo cliente
  save(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/save`, customer);
  }

  // Actualizar un cliente
  update(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/update/${customer.idCustomer}`, customer);
  }

  // Eliminar el cliente seleccionado del localStorage
  clearSelectedCustomer(): void {
    localStorage.removeItem('selectedCustomer');
  }
}
