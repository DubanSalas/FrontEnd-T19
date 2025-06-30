import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/interfaces/customer-interfaces';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  customerForm!: FormGroup;
  documentMaxLength: number = 8;

  private customerService = inject(CustomerService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      idCustomer: [null],
      documentType: ['', [
        Validators.required,
        Validators.pattern(/^\S+$/) // sin espacios
      ]],
      documentNumber: ['', [
        Validators.required,
        Validators.pattern(/^\d+$/)
      ]],
      name: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/)
      ]],
      surname: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/)
      ]],
      address: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ.,#\-]+(?: [A-Za-z0-9ÁÉÍÓÚáéíóúÑñ.,#\-]+)*$/)
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^9\d{8}$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^\S+@\S+\.\S+$/) // sin espacios
      ]],
      dateBirth: [null, Validators.required],
      status: ['A'],
      role: ['cliente']
    });

    this.customerForm.get('documentNumber')?.valueChanges.subscribe(val => {
      const max = this.documentMaxLength;
      if (val && val.length > max) {
        this.customerForm.get('documentNumber')?.setValue(val.slice(0, max), { emitEvent: false });
      }
    });

    this.customerForm.get('phone')?.valueChanges.subscribe(val => {
      if (val && val.length > 9) {
        this.customerForm.get('phone')?.setValue(val.slice(0, 9), { emitEvent: false });
      }
    });

    this.customerService.selectedCustomer$.subscribe(customer => {
      if (customer) {
        this.customerForm.patchValue(customer);
      }
    });

    this.setupDocumentValidation();
  }

  setupDocumentValidation(): void {
    this.customerForm.get('documentType')?.valueChanges.subscribe(type => {
      const control = this.customerForm.get('documentNumber');

      if (type === 'DNI') {
        this.documentMaxLength = 8;
        control?.setValidators([Validators.required, Validators.pattern(/^\d{8}$/)]);
      } else if (type === 'CNE') {
        this.documentMaxLength = 20;
        control?.setValidators([Validators.required, Validators.pattern(/^\d{9,20}$/)]);
      } else {
        this.documentMaxLength = 20;
        control?.setValidators([Validators.required, Validators.pattern(/^\d+$/)]);
      }

      control?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor, revisa los campos marcados antes de continuar.'
      });
      return;
    }

    // 🔧 Limpieza automática de campos
    ['name', 'surname', 'address'].forEach(field => {
      const value = this.customerForm.get(field)?.value;
      if (value) {
        this.customerForm.get(field)?.setValue(value.trim().replace(/\s+/g, ' '));
      }
    });

    ['documentType', 'documentNumber', 'email'].forEach(field => {
      const value = this.customerForm.get(field)?.value;
      if (value) {
        this.customerForm.get(field)?.setValue(value.trim().replace(/\s+/g, ''));
      }
    });

    const formValue = this.customerForm.value;

    const customer: Customer = {
      ...formValue,
      phone: formValue.phone.toString(),
      status: formValue.status || 'A',
      role: formValue.role || 'cliente'
    };

    const isUpdate = !!customer.idCustomer;

    const request$ = isUpdate
      ? this.customerService.update(customer)
      : this.customerService.create(customer);

    request$.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: isUpdate ? 'Cliente actualizado' : 'Cliente registrado',
          text: 'La operación fue exitosa.',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.customerService.setSelectedCustomer(null);
          this.router.navigate(['/admin/customer/list'], {
            state: { action: isUpdate ? 'updated' : 'created' }
          });
        });
      },
      error: (err) => {
        console.error('❌ Error al guardar el cliente:', err);
        const mensaje = err?.error?.message || 'No se pudo guardar el cliente. Revisa los campos o el servidor.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje
        });
      }
    });
  }

  onCancel(): void {
    this.customerService.setSelectedCustomer(null);
    this.router.navigate(['/admin/customer/list']);
  }
}
