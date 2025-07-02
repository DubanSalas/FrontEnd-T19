import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from '../interfaces/customer-interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  // Inyección tradicional de HttpClient a través del constructor
  constructor(private http: HttpClient) {}

  private readonly url = `${environment.urlBackEnd}/v1/api/customer`;  // URL base asegurada con interpolación

  // 🔁 Cliente seleccionado
  private selectedCustomerSubject = new BehaviorSubject<Customer | null>(null);
  selectedCustomer$ = this.selectedCustomerSubject.asObservable();

  setSelectedCustomer(customer: Customer | null): void {
    this.selectedCustomerSubject.next(customer);
  }

  // 📄 Obtener todos los clientes
  findAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.url);  // Método GET para obtener todos los clientes
  }

  // 📄 Filtrar clientes por estado (activo/inactivo)
  findByStatus(status: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.url}/status/${status}`);  // Filtrar por estado
  }

  // 🔍 Buscar cliente por idCustomer
  findById(idCustomer: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.url}/${idCustomer}`);  // Buscar por idCustomer
  }

  // 🆕 Crear un nuevo cliente
  create(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.url}/save`, customer);  // Enviar POST para crear un cliente nuevo
  }

  // ✏️ Actualizar la información de un cliente
  update(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.url}/update/${customer.idCustomer}`, customer);  // Actualizar el cliente
  }

  // ❌ Eliminar un cliente (inactivarlo)
  delete(idCustomer: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${idCustomer}`);  // Realizar DELETE para inactivar al cliente
  }

  // ♻️ Restaurar un cliente (ponerlo como activo)
  restore(idCustomer: number): Observable<void> {
    return this.http.put<void>(`${this.url}/restore/${idCustomer}`, {});  // Restaurar un cliente a su estado activo
  }

  // 📄 Descargar un reporte en formato PDF
  reportPdf(): Observable<Blob> {
    return this.http.get<Blob>(`${this.url}/pdf`, { responseType: 'blob' as 'json' });  // Descargar el reporte en formato Blob (PDF)
  }
}
