import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { CustomerListComponent } from './feature/customer/customer-list/customer-list.component';
import { CustomerFormComponent } from './feature/customer/customer-form/customer-form.component';
import { ProductsListComponent } from './feature/products/products-list/products-list.component';
import { ProductsFormComponent } from './feature/products/products-form/products-form.component';
import { EmployeesListComponent } from './feature/employees/employees-list/employees-list.component';
import { EmployeesFormComponent } from './feature/employees/employees-form/employees-form.component';
import { SalesListComponent } from './feature/transactional/sales/sales-list/sales-list.component';
import { SalesFormComponent } from './feature/transactional/sales/sales-form/sales-form.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'customer/list',
        pathMatch: 'full'
      },
      {
        path: 'customer/list',
        component: CustomerListComponent
      },
      {
        path: 'customer/form',
        component: CustomerFormComponent
      },
      {
        path: 'products/list',
        component: ProductsListComponent
      },
      {
        path: 'products/form',
        component: ProductsFormComponent
      },
      {
        path: 'products/form/:id',
        component: ProductsFormComponent
      },
      {
        path: 'employees/list',
        component: EmployeesListComponent
      },
      {
        path: 'employees/form',
        component: EmployeesFormComponent
      },
      {
        path: 'sales/list',
        component: SalesListComponent
      },
      {
        path: 'sales/form',
        component: SalesFormComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'admin/customer/list',
    pathMatch: 'full'
  }
];
