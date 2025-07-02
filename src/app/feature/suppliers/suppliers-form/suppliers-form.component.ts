import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SupplierService } from '../../../core/services/suppliers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Supplier } from '../../../core/interfaces/suppliers-interfaces';

// Importaciones Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './suppliers-form.component.html',
  styleUrls: ['./suppliers-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule
  ],
})
export class SupplierFormComponent implements OnInit {
  supplierForm!: FormGroup;
  isEditMode = false;
  supplierId!: number;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    // Verificamos si estamos editando
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.supplierId = +idParam;
      this.loadSupplier(this.supplierId);
    }
  }

  initializeForm(): void {
    this.supplierForm = this.fb.group({
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      address: [''],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
      status: ['A'], // por defecto "Activo"
    });
  }

  loadSupplier(id: number): void {
    this.supplierService.getById(id).subscribe({
      next: (supplier) => {
        this.supplierForm.patchValue(supplier);
      },
      error: (err) => {
        console.error('Error loading supplier', err);
      },
    });
  }

  onStatusToggle(checked: boolean): void {
    const statusValue = checked ? 'A' : 'I';
    this.supplierForm.get('status')?.setValue(statusValue);
  }

  onSubmit(): void {
    if (this.supplierForm.invalid) return;

    const supplier: Supplier = this.supplierForm.value;

    if (this.isEditMode) {
      this.supplierService.update(this.supplierId, supplier).subscribe({
        next: () => this.router.navigate(['/admin/suppliers/list']),
        error: (err) => console.error('Error updating supplier', err),
      });
    } else {
      this.supplierService.create(supplier).subscribe({
        next: () => this.router.navigate(['/admin/suppliers/list']),
        error: (err) => console.error('Error creating supplier', err),
      });
    }
  }
}
