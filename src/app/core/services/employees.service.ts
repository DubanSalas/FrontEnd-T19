import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../interfaces/employees-interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private http = inject(HttpClient);
  private readonly url = `${environment.urlBackEnd}/v1/api/employee`;

  // 🔁 Empleado seleccionado
  private selectedEmployeeSubject = new BehaviorSubject<Employee | null>(null);
  selectedEmployee$ = this.selectedEmployeeSubject.asObservable();

  setSelectedEmployee(employee: Employee | null): void {
    this.selectedEmployeeSubject.next(employee);
  }

  // 📄 Obtener todos
  findAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.url);
  }

  // 📄 Filtrar por estado
  findByStatus(status: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.url}/status/${status}`);
  }

  // 🔍 Buscar por ID
  findById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.url}/${id}`);
  }

  // 🆕 Crear nuevo
  create(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.url}/save`, employee);
  }

  // ✏️ Actualizar
  update(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.url}/update/${employee.idEmployee}`, employee);
  }

  // ❌ Inactivar
  delete(id: number): Observable<void> {
    return this.http.patch<void>(`${this.url}/delete/${id}`, {});
  }

  // ♻️ Restaurar
  restore(id: number): Observable<void> {
    return this.http.put<void>(`${this.url}/restore/${id}`, {});
  }
}
