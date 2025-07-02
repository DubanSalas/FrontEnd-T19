import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // Asegúrate de importar CommonModule
import { ReactiveFormsModule } from '@angular/forms';  // Si usas formularios reactivos
import Swal from 'sweetalert2';
import { ProductService } from '../../../core/services/products.service';
import { Product } from '../../../core/interfaces/products-interfaces';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],  // Asegúrate de añadir CommonModule aquí
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss']
})
export class ProductsFormComponent implements OnInit {
  productForm: FormGroup;
  idProducto: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      expirationDate: ['', Validators.required], // Validación para la fecha de expiración
      status: ['A', Validators.required], // Estado por defecto 'A' (activo)
      type: ['', Validators.required] // Tipo de producto
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idProducto = Number(idParam);
      this.loadProduct(this.idProducto);
    }
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          productName: product.productName,
          description: product.description,
          price: product.price,
          stock: product.stock,
          expirationDate: product.expirationDate,
          status: product.status,
          type: product.type
        });
      },
      error: () => {
        Swal.fire('Error', 'Producto no encontrado', 'error');
        this.router.navigate(['/admin/products/list']);
      }
    });
  }

  async saveProduct(): Promise<void> {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      Swal.fire('Error', 'Por favor corrija los errores en el formulario.', 'error');
      return;
    }

    const formData = new FormData();
    Object.entries(this.productForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (this.idProducto) {
      this.productService.updateProduct(formData, this.idProducto).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'Producto actualizado correctamente', 'success');
          this.router.navigate(['/admin/products/list']);
        },
        error: err => Swal.fire('Error', 'Error al actualizar producto: ' + err.message, 'error')
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => {
          Swal.fire('Creado', 'Producto creado correctamente', 'success');
          this.router.navigate(['/admin/products/list']);
        },
        error: err => Swal.fire('Error', 'Error al crear producto: ' + err.message, 'error')
      });
    }
  }

  async cancelEdit(): Promise<void> {
    const confirmCancel = await Swal.fire({
      title: '¿Desea cancelar?',
      text: 'Se perderán los cambios no guardados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Seguir editando'
    });

    if (confirmCancel.isConfirmed) {
      this.router.navigate(['/admin/products/list']);
    }
  }

  get productName() { return this.productForm.get('productName')!; }
  get description() { return this.productForm.get('description')!; }
  get price() { return this.productForm.get('price')!; }
  get stock() { return this.productForm.get('stock')!; }
  get expirationDate() { return this.productForm.get('expirationDate')!; }
  get status() { return this.productForm.get('status')!; }
  get type() { return this.productForm.get('type')!; }
}
