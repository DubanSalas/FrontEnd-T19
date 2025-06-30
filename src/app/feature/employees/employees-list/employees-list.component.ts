import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { EmployeeService } from '../../../core/services/employees.service';
import { Employee } from '../../../core/interfaces/employees-interfaces';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent implements OnInit {

  state: string = 'A';
  searchTerm: string = '';
  displayedColumns: string[] = [
    'idEmployee', 'name', 'surname', 'post', 'phone', 'status', 'actions'
  ];
  dataSource: Employee[] = [];
  filteredData: Employee[] = [];

  private employeeService = inject(EmployeeService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadEmployeesByState();
  }

  setState(newState: string): void {
    if (this.state !== newState) {
      this.state = newState;
      this.loadEmployeesByState();
    }
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredData = this.dataSource.filter(employee =>
      employee.name.toLowerCase().includes(term) ||
      employee.surname.toLowerCase().includes(term)
    );
  }

  loadEmployeesByState(): void {
    this.employeeService.findByStatus(this.state).subscribe({
      next: (data) => {
        this.dataSource = data;
        this.applyFilter();
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los empleados.', 'error');
      }
    });
  }

  goEmployeeForm(): void {
    this.employeeService.setSelectedEmployee(null);
    this.router.navigate(['/admin/employees/form']);
  }

  onEdit(employee: Employee): void {
    this.employeeService.setSelectedEmployee(employee);
    this.router.navigate(['/admin/employees/form']);
  }

  delete(id: number): void {
    Swal.fire({
      title: '¿Deseas inactivar este empleado?',
      text: 'El empleado cambiará a estado inactivo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, inactivar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.employeeService.delete(id).subscribe({
          next: () => {
            Swal.fire('Inactivado', 'Empleado inactivado correctamente.', 'success');
            this.loadEmployeesByState();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo inactivar el empleado.', 'error');
          }
        });
      }
    });
  }

  restore(id: number): void {
    Swal.fire({
      title: '¿Deseas restaurar este empleado?',
      text: 'El empleado será marcado como activo nuevamente.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.employeeService.restore(id).subscribe({
          next: () => {
            Swal.fire('Restaurado', 'Empleado restaurado correctamente.', 'success');
            this.loadEmployeesByState();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo restaurar el empleado.', 'error');
          }
        });
      }
    });
  }
}
