import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../../core/services/products.service';
import { Product } from '../../../core/interfaces/products-interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  searchTerm: string = '';
  statusFilter: string = 'A';
  typeFilter: string = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(data => {
      this.products = data;
      this.applyFilters();
    });
  }

  applyFilters() {
    const search = this.searchTerm.toLowerCase();

    this.filteredProducts = this.products.filter(product => {
      const productName = product.productName?.toLowerCase() || '';
      const description = product.description?.toLowerCase() || '';
      const type = product.type?.toLowerCase() || '';

      const matchesSearch = productName.includes(search) || description.includes(search);
      const matchesStatus = this.statusFilter ? product.status === this.statusFilter : true;
      const matchesType = this.typeFilter ? type === this.typeFilter.toLowerCase() : true;

      return matchesSearch && matchesStatus && matchesType;
    });
  }

  filterProducts() {
    this.applyFilters();
  }

  setStatusFilter(status: string) {
    this.statusFilter = this.statusFilter === status ? '' : status;
    this.applyFilters();
  }

  setTypeFilter(type: string) {
    this.typeFilter = this.typeFilter === type ? '' : type;
    this.applyFilters();
  }

  editProduct(idProduct: number) {
    this.router.navigate(['/admin/products/form', idProduct]);
  }

  confirmDeleteProduct(product: Product) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea inactivar el producto "${product.productName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, inactivar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.deleteProduct(product);
      }
    });
  }

  deleteProduct(product: Product) {
    product.status = 'I';

    if (product.idProduct) {
      const formData = new FormData();
      formData.append('productName', product.productName || '');
      formData.append('description', product.description || '');
      formData.append('price', product.price?.toString() || '0');
      formData.append('stock', product.stock?.toString() || '0');
      formData.append('status', product.status);
      formData.append('type', product.type || '');
      formData.append('storeIdStore', product.storeIdStore?.toString() || '1');

      if (product.image && (product.image as any) instanceof File) {
        formData.append('image', product.image);
      }

      this.productService.updateProduct(formData, product.idProduct).subscribe(() => {
        Swal.fire('Inactivado', 'Producto inactivado correctamente', 'success');
        this.loadProducts();
      });
    }
  }

  confirmReactivateProduct(product: Product) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea restaurar el producto "${product.productName}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.reactivateProduct(product);
      }
    });
  }

  reactivateProduct(product: Product) {
    product.status = 'A';

    if (product.idProduct) {
      const formData = new FormData();
      formData.append('productName', product.productName || '');
      formData.append('description', product.description || '');
      formData.append('price', product.price?.toString() || '0');
      formData.append('stock', product.stock?.toString() || '0');
      formData.append('status', product.status);
      formData.append('type', product.type || '');
      formData.append('storeIdStore', product.storeIdStore?.toString() || '1');

      if (product.image && (product.image as any) instanceof File) {
        formData.append('image', product.image);
      }

      this.productService.updateProduct(formData, product.idProduct).subscribe(() => {
        Swal.fire('Restaurado', 'Producto restaurado correctamente', 'success');
        this.loadProducts();
      });
    }
  }

  createProduct() {
    this.router.navigate(['/admin/products/form']);
  }

  getProductType(product: Product): string {
    return product.type || '-';
  }

  // ✅ NUEVA FUNCIÓN PARA GENERAR REPORTE PDF
  reportPdf() {
    this.productService.reportPdf().subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'reporte_productos.pdf';
      link.click();
      URL.revokeObjectURL(url);
    });
  }
}
