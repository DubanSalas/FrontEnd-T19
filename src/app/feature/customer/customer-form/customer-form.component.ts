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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
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
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  customerForm!: FormGroup;
  documentMaxLength: number = 8;
  isButtonDisabled = true;

  private customerService = inject(CustomerService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initializeForm();
    this.setupDocumentValidation();

    this.customerForm.valueChanges.subscribe(() => {
      this.isButtonDisabled = this.customerForm.invalid;
    });

    this.customerService.selectedCustomer$.subscribe(customer => {
      if (customer) {
        this.customerForm.patchValue(customer);
      }
    });
  }

  initializeForm(): void {
    this.customerForm = this.fb.group({
      clientCode: [''],
      documentType: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
      documentNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/)]],
      surname: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/)]],
      address: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ.,#\-]+(?: [A-Za-z0-9ÁÉÍÓÚáéíóúÑñ.,#\-]+)*$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^\S+@\S+\.\S+$/)]],
      dateBirth: [null, [Validators.required, this.ageValidator]],
      status: ['A'],
      role: ['cliente']
    });

    this.customerForm.get('documentNumber')?.valueChanges.subscribe(val => {
      this.limitFieldLength('documentNumber', this.documentMaxLength, val);
    });

    this.customerForm.get('phone')?.valueChanges.subscribe(val => {
      this.limitFieldLength('phone', 9, val);
    });
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

  limitFieldLength(fieldName: string, maxLength: number, value: string): void {
    if (value && value.length > maxLength) {
      this.customerForm.get(fieldName)?.setValue(value.slice(0, maxLength), { emitEvent: false });
    }
  }

  ageValidator(control: any): { [key: string]: boolean } | null {
    const birthDate = control.value;
    if (!birthDate) return null;

    const currentDate = new Date();
    const birth = new Date(birthDate);

    let age = currentDate.getFullYear() - birth.getFullYear();
    const month = currentDate.getMonth() - birth.getMonth();

    if (month < 0 || (month === 0 && currentDate.getDate() < birth.getDate())) {
      age--;
    }

    return age < 18 ? { underage: true } : null;
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

    this.cleanUpFormData();

    const formValue = this.customerForm.value;
    const customer: Customer = {
      ...formValue,
      phone: formValue.phone.toString(),
      status: formValue.status || 'A',
      role: formValue.role || 'cliente'
    };

    const isUpdate = !!customer.clientCode;

    if (!isUpdate) {
      Swal.fire({
        icon: 'info',
        title: 'Creando nuevo cliente',
        text: 'El clientCode será generado automáticamente.'
      });
    }

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

  cleanUpFormData(): void {
    ['name', 'surname', 'address', 'documentType', 'documentNumber', 'email'].forEach(field => {
      const value = this.customerForm.get(field)?.value;
      if (value) {
        this.customerForm.get(field)?.setValue(value.trim().replace(/\s+/g, ' '));
      }
    });
  }

  onCancel(): void {
    this.customerService.setSelectedCustomer(null);
    this.router.navigate(['/admin/customer/list']);
  }
}
