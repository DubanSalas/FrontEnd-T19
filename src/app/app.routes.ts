import { Routes } from '@angular/router';

// Layout principal
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

// Dashboard

// Clientes
import { CustomerListComponent } from './feature/customer/customer-list/customer-list.component';
import { CustomerFormComponent } from './feature/customer/customer-form/customer-form.component';

// Productos
import { ProductsListComponent } from './feature/products/products-list/products-list.component';
import { ProductsFormComponent } from './feature/products/products-form/products-form.component';

// Empleados
import { EmployeesListComponent } from './feature/employees/employees-list/employees-list.component';
import { EmployeesFormComponent } from './feature/employees/employees-form/employees-form.component';

// Ventas
import { SalesListComponent } from './feature/transactional/sales/sales-list/sales-list.component';
import { SalesFormComponent } from './feature/transactional/sales/sales-form/sales-form.component';

// Proveedores
import { SuppliersListComponent } from './feature/suppliers/suppliers-list/suppliers-list.component';
import { SupplierFormComponent } from './feature/suppliers/suppliers-form/suppliers-form.component';

// Compras
import { BuysListComponent } from './feature/transactional/buy/buy-list/buy-list.component';
import { BuysFormComponent } from './feature/transactional/buy/buy-form/buy-form.component';

// Almacenes

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'customer/list', pathMatch: 'full' },  // Ruta principal - Dashboard


      // Clientes
      { path: 'customer/list', component: CustomerListComponent },
      { path: 'customer/form', component: CustomerFormComponent },

      // Productos
      { path: 'products/list', component: ProductsListComponent },
      { path: 'products/form', component: ProductsFormComponent },
      { path: 'products/form/:id', component: ProductsFormComponent },

      // Empleados
      { path: 'employees/list', component: EmployeesListComponent },
      { path: 'employees/form', component: EmployeesFormComponent },

      // Ventas
      { path: 'sales/list', component: SalesListComponent },
      { path: 'sales/form', component: SalesFormComponent },

      // Proveedores
      { path: 'suppliers/list', component: SuppliersListComponent },
      { path: 'suppliers/form', component: SupplierFormComponent },
      { path: 'suppliers/form/:id', component: SupplierFormComponent },

      // Compras
      { path: 'buys', component: BuysListComponent },
      { path: 'buys/form', component: BuysFormComponent },
      { path: 'buys/form/:id', component: BuysFormComponent },

    ],
  },
  {
    path: '**',
    redirectTo: 'admin/customer/list',
    pathMatch: 'full',
  },
];
