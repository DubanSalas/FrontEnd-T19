import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { SaleService } from '../../../../core/services/sales.service';
import { Customer } from '../../../../core/interfaces/customer-interfaces';
import { Employee } from '../../../../core/interfaces/employees-interfaces';
import { Product } from '../../../../core/interfaces/products-interfaces';
import { Sale, SaleDetail } from '../../../../core/interfaces/sales-interfaces';

@Component({
  selector: 'app-sales-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './sales-form.component.html',
  styleUrls: ['./sales-form.component.scss']
})
export class SalesFormComponent implements OnInit {
  saleForm!: FormGroup;
  customers: Customer[] = [];
  employees: Employee[] = [];
  products: Product[] = [];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private saleService = inject(SaleService);

  ngOnInit(): void {
    this.saleForm = this.fb.group({
      idCustomer: ['', Validators.required], // Store the selected customer ID
      idEmployee: ['', Validators.required], // Store the selected employee ID
      paymentMethod: ['', Validators.required],
      details: this.fb.array([this.createDetail()]) // Form array for sale details
    });

    this.loadCustomers();
    this.loadEmployees();
    this.loadProducts();
  }

  get details(): FormArray {
    return this.saleForm.get('details') as FormArray;
  }

  createDetail(): FormGroup {
    return this.fb.group({
      idProduct: ['', Validators.required], // Store the selected product ID
      amount: [1, [Validators.required, Validators.min(1)]], // Default quantity is 1
      price: [0, [Validators.required, Validators.min(0.01)]] // Price can't be 0 or less
    });
  }

  addDetail(): void {
    this.details.push(this.createDetail());
  }

  removeDetail(index: number): void {
    this.details.removeAt(index);
  }

  getSubtotal(index: number): number {
    const group = this.details.at(index);
    const quantity = group.get('amount')?.value || 0;
    const price = group.get('price')?.value || 0;
    return quantity * price;
  }

  getTotal(): number {
    return this.details.controls.reduce((total, group) => {
      const qty = group.get('amount')?.value || 0;
      const price = group.get('price')?.value || 0;
      return total + (qty * price);
    }, 0);
  }

  onSubmit(): void {
    if (this.saleForm.valid) {
      const form = this.saleForm.value;

      const saleData: Sale = {
        idCustomer: form.idCustomer,
        idEmployee: form.idEmployee,
        saleDate: new Date().toISOString().split('T')[0], // Current date
        paymentMethod: form.paymentMethod,
        total: this.getTotal(),
        details: form.details.map((d: any): SaleDetail => ({
          idProduct: d.idProduct,  // Storing product ID
          amount: d.amount,
          price: d.price,
          total: d.amount * d.price
        }))
      };

      this.saleService.save(saleData).subscribe({
        next: () => this.router.navigate(['/admin/sales/list']),
        error: (err) => console.error('Error al registrar la venta', err)
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/sales/list']);
  }

  // Load active customers
  loadCustomers(): void {
    this.saleService.getCustomers().subscribe({
      next: (data) => this.customers = data.filter(c => c.status?.toLowerCase() === 'activo'), // Only active customers
      error: (err) => console.error('Error cargando clientes', err)
    });
  }

  // Load active employees
  loadEmployees(): void {
    this.saleService.getEmployees().subscribe({
      next: (data) => this.employees = data.filter(e => e.status?.toLowerCase() === 'activo'), // Only active employees
      error: (err) => console.error('Error cargando empleados', err)
    });
  }

  // Load active products
  loadProducts(): void {
    this.saleService.getProducts().subscribe({
      next: (data) => this.products = data.filter(p => p.status?.toLowerCase() === 'activo'), // Only active products
      error: (err) => console.error('Error cargando productos', err)
    });
  }
}
