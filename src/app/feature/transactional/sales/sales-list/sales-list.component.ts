import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router, RouterModule } from '@angular/router';

import { SaleService } from '../../../../core/services/sales.service';
import { Sale } from '../../../../core/interfaces/sales-interfaces';
import { Product } from '../../../../core/interfaces/products-interfaces';
import { Customer } from '../../../../core/interfaces/customer-interfaces';
import { Employee } from '../../../../core/interfaces/employees-interfaces';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    RouterModule
  ],
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss']
})
export class SalesListComponent implements OnInit {
  sales: Sale[] = [];
  products: Product[] = [];
  customers: Customer[] = [];
  employees: Employee[] = [];

  displayedDetailColumns: string[] = ['product', 'amount', 'price', 'total'];

  private saleService = inject(SaleService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadSales();
    this.loadProducts();
    this.loadCustomers();
    this.loadEmployees();
  }

  loadSales(): void {
    this.saleService.getAll().subscribe({
      next: (data: Sale[]) => {
        this.sales = data;
        console.log('Sales loaded:', this.sales);
      },
      error: (err: any) => console.error('Error al obtener ventas', err)
    });
  }

  loadProducts(): void {
    this.saleService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data.filter(p => p.status?.toLowerCase() === 'activo');
        console.log('Productos cargados:', this.products);  // Log data for verification
      },
      error: (err: any) => console.error('Error al cargar productos', err)
    });
  }

  loadCustomers(): void {
    this.saleService.getCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customers = data.filter(c => c.status?.toLowerCase() === 'activo');
        console.log('Clientes cargados:', this.customers);  // Log data for verification
      },
      error: (err: any) => console.error('Error al cargar clientes', err)
    });
  }

  loadEmployees(): void {
    this.saleService.getEmployees().subscribe({
      next: (data: Employee[]) => {
        this.employees = data.filter(e => e.status?.toLowerCase() === 'activo');
        console.log('Empleados cargados:', this.employees);  // Log data for verification
      },
      error: (err: any) => console.error('Error al cargar empleados', err)
    });
  }

  // Update these methods to return only the IDs instead of the names
  getProductName(id: number): string {
    return id ? id.toString() : 'Desconocido';  // Only return ID as string
  }

  getCustomerName(id: number): string {
    return id ? id.toString() : 'Desconocido';  // Only return ID as string
  }

  getEmployeeName(id: number): string {
    return id ? id.toString() : 'Desconocido';  // Only return ID as string
  }

  formatCurrency(value: number): string {
    return 'S/. ' + value.toFixed(2);
  }

  onRegisterSale(): void {
    this.router.navigate(['/admin/sales/form']);
  }
}
