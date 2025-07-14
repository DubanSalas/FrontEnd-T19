import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from '../interfaces/Student';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private readonly url = `${environment.urlBackEnd}/v1/api/student`;

  constructor(private http: HttpClient) { }

  // Estudiante seleccionado
  private selectedStudentSubject = new BehaviorSubject<Student | null>(null);
  selectedStudent$ = this.selectedStudentSubject.asObservable();

  setSelectedStudent(student: Student | null): void {
    this.selectedStudentSubject.next(student);
  }

  // CRUD estudiantes
  findByStatus(status: 'A' | 'I'): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.url}/status/${status}`);
  }

  create(student: Student): Observable<Student> {
    return this.http.post<Student>(`${this.url}/save`, student);
  }

  update(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.url}/update/${student.idStudent}`, student);
  }

  delete(idStudent: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${idStudent}`);
  }

  restore(idStudent: number): Observable<void> {
    return this.http.put<void>(`${this.url}/restore/${idStudent}`, {});
  }

  // Generar reporte PDF sin filtro
  reportPdf(): Observable<Blob> {
    return this.http.get<Blob>(`${this.url}/pdf`, { responseType: 'blob' as 'json' });
  }

  // Generar reporte PDF filtrado por Ubigeo
  reportPdfByUbigeo(ubigeo: string): Observable<Blob> {
    return this.http.get<Blob>(`${this.url}/pdf/${ubigeo}`, { responseType: 'blob' as 'json' });
  }

  // Métodos para cargar datos de ubigeo desde assets
  getRawDepartments(): Observable<any[]> {
    return this.http.get<any[]>('/assets/ubigeo/departamentos.json');
  }

  getRawProvinces(): Observable<any[]> {
    return this.http.get<any[]>('/assets/ubigeo/provincias.json');
  }

  getRawDistricts(): Observable<any[]> {
    return this.http.get<any[]>('/assets/ubigeo/distritos.json');
  }

   // === Filtros individuales desde el backend (si existen rutas) ===
  getByDepartment(department: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.url}/department/${department}`);
  }

  getByProvince(province: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.url}/province/${province}`);
  }

  getByDistrict(district: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.url}/district/${district}`);
  }
  
   getByAge(age: number): Observable<Student[]> {
  return this.http.get<Student[]>(`${this.url}/age/${age}`);
}

}
