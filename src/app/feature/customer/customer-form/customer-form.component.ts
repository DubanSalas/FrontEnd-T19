import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/interfaces/customer-interfaces';

/* ────────── Angular-Material standalone imports ────────── */
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule, // Asegúrate de importar este módulo si necesitas usar tablas
  ],
})
export class CustomerFormComponent implements OnInit {
  readonly form: FormGroup;
  readonly customerService = inject(CustomerService);
  readonly router = inject(Router);

  isEditMode = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      idCustomer: [{ value: '', disabled: true }],
      documentType: ['', Validators.required],
      documentNumber: ['', [Validators.required, Validators.pattern(/^\d{8,20}$/)]],
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/)]],
      role: ['', Validators.required],
      dateBirth: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
      address: ['', Validators.required],
    });

    // Lógica para ajustar la validación del documento según el tipo de documento
    this.form.get('documentType')?.valueChanges.subscribe((value) => {
      const documentNumber = this.form.get('documentNumber');
      if (value === 'DNI') {
        documentNumber?.setValidators([Validators.required, Validators.pattern(/^\d{8}$/)]);
      } else if (value === 'CNE') {
        documentNumber?.setValidators([Validators.required, Validators.pattern(/^\d{9,20}$/)]);
      }
      documentNumber?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    const customer = this.customerService.getSelectedCustomer();
    if (customer) {
      this.isEditMode = true;
      this.form.patchValue(customer);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Swal.fire('Formulario inválido', 'Rellena todos los campos obligatorios', 'error');
      return;
    }

    const payload = this.form.value as Customer;
    const isUpdate = !!payload.idCustomer;

    Swal.fire({
      title: isUpdate ? '¿Actualizar cliente?' : '¿Registrar cliente?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: isUpdate ? 'Actualizar' : 'Registrar',
      cancelButtonText: 'Cancelar',
    }).then(({ isConfirmed }) => {
      if (!isConfirmed) return;

      const request$ = isUpdate
        ? this.customerService.update(payload)
        : this.customerService.save(payload);

      request$.subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: isUpdate ? 'Cliente actualizado' : 'Cliente registrado',
          }).then(() => {
            localStorage.removeItem('selectedCustomer');
            this.router.navigate(['/customer-list']);
          });
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'Hubo un problema al guardar', 'error');
        },
      });
    });
  }

  onCancel(): void {
    localStorage.removeItem('selectedCustomer');
    this.router.navigate(['/customer-list']);
  }
}
