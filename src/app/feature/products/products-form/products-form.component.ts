import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ProductService } from '../../../core/services/products.service';
import { Product } from '../../../core/interfaces/products-interfaces';
import { firstValueFrom } from 'rxjs';

// Validador personalizado para que el valor sea mayor que 0
export function greaterThanZeroValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value !== null && control.value !== undefined && control.value <= 0) {
      return { notGreaterThanZero: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss']
})
export class ProductsFormComponent implements OnInit {
  productForm: FormGroup;
  idProducto: number | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  typeOptions = ['Pan', 'Torta', 'Bocadito'];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [null, [Validators.required, Validators.min(0), greaterThanZeroValidator()]],
      stock: [null, [Validators.required, Validators.min(0), greaterThanZeroValidator()]],
      status: ['A', Validators.required],
      type: ['', Validators.required],
      storeIdStore: [1, Validators.required]
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
          status: product.status,
          type: product.type,
          storeIdStore: product.storeIdStore ?? 1
        });

        if (product.image) {
          this.imagePreview = `http://localhost:8080/uploads/products/${product.image}`;
        }
      },
      error: () => {
        Swal.fire('Error', 'Producto no encontrado', 'error');
        this.router.navigate(['/admin/products/list']);
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFile = null;
      this.imagePreview = null;
      return;
    }

    this.selectedFile = input.files[0];

    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result;
    reader.readAsDataURL(this.selectedFile);
  }

  async saveProduct(): Promise<void> {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      Swal.fire('Error', 'Por favor corrija los errores en el formulario.', 'error');
      return;
    }

    // Validación extra, por seguridad, aunque el validador ya está
    if (this.price.value <= 0) {
      Swal.fire('Error', 'El precio debe ser mayor que 0.', 'error');
      return;
    }
    if (this.stock.value <= 0) {
      Swal.fire('Error', 'El stock debe ser mayor que 0.', 'error');
      return;
    }

    // Validar que no exista otro producto con el mismo nombre
    try {
      if (this.idProducto) {
        const originalProduct = await firstValueFrom(this.productService.getProductById(this.idProducto));

        if (!originalProduct) {
          Swal.fire('Error', 'No se pudo cargar el producto original para la validación.', 'error');
          return;
        }

        if (originalProduct.productName.toLowerCase() !== this.productName.value.toLowerCase()) {
          // Validar que no exista otro producto con ese nombre
          const allProducts = await firstValueFrom(this.productService.getAllProducts());
          const duplicate = allProducts.find(p => p.productName.toLowerCase() === this.productName.value.toLowerCase());

          if (duplicate) {
            Swal.fire('Error', 'Ya existe un producto con ese nombre.', 'error');
            return;
          }
        }
      } else {
        // Si es creación, validar directamente si ya existe el producto con ese nombre
        const allProducts = await firstValueFrom(this.productService.getAllProducts());
        const duplicate = allProducts.find(p => p.productName.toLowerCase() === this.productName.value.toLowerCase());

        if (duplicate) {
          Swal.fire('Error', 'Ya existe un producto con ese nombre.', 'error');
          return;
        }
      }
    } catch (error) {
      Swal.fire('Error', 'Error al validar el nombre del producto.', 'error');
      return;
    }

    const confirmResult = await Swal.fire({
      title: '¿Está seguro?',
      text: this.idProducto ? 'Se actualizará el producto.' : 'Se creará un nuevo producto.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmResult.isConfirmed) return;

    const formData = new FormData();

    Object.entries(this.productForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

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

  // Método para cancelar edición, llamado desde botón cancelar
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

  // Getters para validaciones en la plantilla
  get productName() { return this.productForm.get('productName')!; }
  get description() { return this.productForm.get('description')!; }
  get price() { return this.productForm.get('price')!; }
  get stock() { return this.productForm.get('stock')!; }
  get type() { return this.productForm.get('type')!; }
}
