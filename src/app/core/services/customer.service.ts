import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from '../interfaces/customer-interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private http = inject(HttpClient);
  private readonly url = `${environment.urlBackEnd}/v1/api/customer`;

  // 🔁 Cliente seleccionado
  private selectedCustomerSubject = new BehaviorSubject<Customer | null>(null);
  selectedCustomer$ = this.selectedCustomerSubject.asObservable();

  setSelectedCustomer(customer: Customer | null): void {
    this.selectedCustomerSubject.next(customer);
  }

  // 📄 Obtener todos
  findAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.url);
  }

  // 📄 Filtrar por estado
  findByStatus(status: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.url}/status/${status}`);
  }

  // 🔍 Buscar por ID
  findById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.url}/${id}`);
  }

  // 🆕 Crear nuevo
  create(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.url}/save`, customer);
  }

  // ✏️ Actualizar
  update(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.url}/update/${customer.idCustomer}`, customer);
  }

  // ❌ Inactivar
  delete(id: number): Observable<void> {
    return this.http.patch<void>(`${this.url}/delete/${id}`, {});
  }

  // ♻️ Restaurar
  restore(id: number): Observable<void> {
    return this.http.put<void>(`${this.url}/restore/${id}`, {});
  }

  // 📄 Descargar reporte PDF
  reportPdf(): Observable<Blob> {
    return this.http.get(`${this.url}/pdf`, { responseType: 'blob' });
  }
}
