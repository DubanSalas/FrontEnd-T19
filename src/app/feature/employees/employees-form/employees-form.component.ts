import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { EmployeeService } from '../../../core/services/employees.service';
import { Employee } from '../../../core/interfaces/employees-interfaces';

@Component({
  selector: 'app-employees-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './employees-form.component.html',
  styleUrls: ['./employees-form.component.scss']
})
export class EmployeesFormComponent implements OnInit {
  employeeForm!: FormGroup;
  cargos: string[] = ['Administrador', 'Cajero', 'Supervisor', 'Vendedor'];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      idEmployee: [null],
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/)]],
      surname: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/)]],
      post: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
      status: ['A']
    });

    this.employeeService.selectedEmployee$.subscribe(emp => {
      if (emp) {
        this.employeeForm.patchValue(emp);
      }
    });

    this.limitPhoneLength();
  }

  // Limita a 9 caracteres el teléfono
  limitPhoneLength(): void {
    this.employeeForm.get('phone')?.valueChanges.subscribe(val => {
      if (val && val.length > 9) {
        this.employeeForm.get('phone')?.setValue(val.slice(0, 9), { emitEvent: false });
      }
    });
  }

  // Enviar formulario
  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      Swal.fire('Campos inválidos', 'Por favor completa todos los campos obligatorios.', 'warning');
      return;
    }

    // Limpieza automática
    ['name', 'surname'].forEach(field => {
      const value = this.employeeForm.get(field)?.value;
      if (value) {
        this.employeeForm.get(field)?.setValue(value.trim().replace(/\s+/g, ' '));
      }
    });

    const formValue: Employee = {
      ...this.employeeForm.value,
      phone: this.employeeForm.value.phone.toString()
    };

    const isUpdate = !!formValue.idEmployee;

    const request$ = isUpdate
      ? this.employeeService.update(formValue)
      : this.employeeService.create(formValue);

    request$.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: isUpdate ? 'Empleado actualizado' : 'Empleado registrado',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.employeeService.setSelectedEmployee(null);
          this.router.navigate(['/admin/employees/list'], {
            state: { action: isUpdate ? 'updated' : 'created' }
          });
        });
      },
      error: () => {
        Swal.fire('Error', 'No se pudo guardar el empleado.', 'error');
      }
    });
  }

  // Cancelar y volver al listado
  onCancel(): void {
    this.employeeService.setSelectedEmployee(null);
    this.router.navigate(['/admin/employees/list']);
  }
}
