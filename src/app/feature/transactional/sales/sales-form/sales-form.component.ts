import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { SaleService } from '../../../../core/services/sales.service';
import { CustomerService } from '../../../../core/services/customer.service';

import { Customer } from '../../../../core/interfaces/customer-interfaces';
import { Employee } from '../../../../core/interfaces/employees-interfaces';
import { Product } from '../../../../core/interfaces/products-interfaces';
import { Sale, SaleDetail } from '../../../../core/interfaces/sales-interfaces';
import { EmployeeService } from '../../../../core/services/employees.service';
import { ProductService } from '../../../../core/services/products.service';

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
  private customerService = inject(CustomerService);
  private employeeService = inject(EmployeeService);
  private productService = inject(ProductService);

  ngOnInit(): void {
    this.saleForm = this.fb.group({
      idCustomer: ['', Validators.required],
      idEmployee: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      details: this.fb.array([this.createDetail()])
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
      idProduct: ['', Validators.required],
      amount: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  addDetail(): void {
    this.details.push(this.createDetail());
  }

  removeDetail(index: number): void {
    if (this.details.length > 1) {
      this.details.removeAt(index);
    }
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
        saleDate: new Date().toISOString().split('T')[0],
        paymentMethod: form.paymentMethod,
        total: this.getTotal(),
        details: form.details.map((d: any): SaleDetail => ({
          idProduct: d.idProduct,
          amount: d.amount,
          price: d.price,
          total: d.amount * d.price
        }))
      };

      this.saleService.save(saleData).subscribe({
        next: () => this.router.navigate(['/admin/sales/list']),
        error: (err: any) => console.error('Error al registrar la venta', err)
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/sales/list']);
  }

  loadCustomers(): void {
    this.customerService.findByStatus('activo').subscribe({
      next: (data: Customer[]) => this.customers = data,
      error: (err: any) => console.error('Error cargando clientes', err)
    });
  }

  loadEmployees(): void {
    this.employeeService.findByStatus('activo').subscribe({
      next: (data: Employee[]) => this.employees = data,
      error: (err: any) => console.error('Error cargando empleados', err)
    });
  }

  loadProducts(): void {
    this.productService.getProductsByStatus('activo').subscribe({
      next: (data: Product[]) => this.products = data,
      error: (err: any) => console.error('Error cargando productos', err)
    });
  }
}
