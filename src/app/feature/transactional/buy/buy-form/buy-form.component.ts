import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { BuyService } from '../../../../core/services/buy.service';
import { PurchaseDetailService } from '../../../../core/services/purchase.detail.service';
import { Buy } from '../../../../core/interfaces/buy-interfaces';
import { PurchaseDetail } from '../../../../core/interfaces/purchase-detail-interfaces';

@Component({
  selector: 'app-buys-form',
  templateUrl: './buy-form.component.html',
  styleUrls: ['./buy-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class BuysFormComponent implements OnInit {
  buyForm!: FormGroup;
  buyId?: number;
  loading = false;
  error = '';
  
  // Propiedad para template: indica si es modo edición o creación
  get isEditMode(): boolean {
    return !!this.buyId;
  }

  get details(): FormArray {
    return this.buyForm.get('details') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private buyService: BuyService,
    private detailService: PurchaseDetailService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buyId = this.route.snapshot.params['id'];
    this.initForm();

    if (this.buyId) {
      this.loadBuy(this.buyId);
      this.loadDetails(this.buyId);
    }
  }

  initForm(): void {
    this.buyForm = this.fb.group({
      idSupplier: [null, Validators.required],
      purchaseDate: [null, Validators.required],
      totalAmount: [{value: 0, disabled: true}],
      paymentType: ['', Validators.required],
      details: this.fb.array([])
    });
  }

  loadBuy(id: number): void {
    this.buyService.getBuyById(id).subscribe({
      next: (buy) => {
        this.buyForm.patchValue({
          idSupplier: buy.idSupplier,
          purchaseDate: buy.purchaseDate,
          paymentType: buy.paymentType
        });
      },
      error: () => {
        this.error = 'Error loading buy';
      }
    });
  }

  loadDetails(buyId: number): void {
    this.detailService.getDetailsByBuyId(buyId).subscribe({
      next: (details) => {
        details.forEach(detail => {
          this.details.push(this.createDetailGroup(detail));
        });
        this.calculateTotal();
      },
      error: () => {
        this.error = 'Error loading purchase details';
      }
    });
  }

  createDetailGroup(detail?: PurchaseDetail): FormGroup {
    return this.fb.group({
      id: [detail ? detail.id : null],
      idProduct: [detail ? detail.idProduct : null, Validators.required],
      amount: [detail ? detail.amount : 1, [Validators.required, Validators.min(1)]],
      subtotal: [{value: detail ? detail.subtotal : 0, disabled: true}]
    });
  }

  addDetail(): void {
    this.details.push(this.createDetailGroup());
  }

  removeDetail(index: number): void {
    this.details.removeAt(index);
    this.calculateTotal();
  }

  onAmountChange(index: number): void {
    const group = this.details.at(index);
    const amount = group.get('amount')?.value || 0;
    const price = this.getProductPrice(group.get('idProduct')?.value);
    const subtotal = amount * price;
    group.get('subtotal')?.setValue(subtotal);
    this.calculateTotal();
  }

  getProductPrice(productId: number): number {
    return 10; // Ejemplo fijo
  }

  calculateTotal(): void {
    let total = 0;
    this.details.controls.forEach(ctrl => {
      total += ctrl.get('subtotal')?.value || 0;
    });
    this.buyForm.get('totalAmount')?.setValue(total);
  }

  // Cambié de save() a onSubmit() para que coincida con el template
  onSubmit(): void {
    if (this.buyForm.invalid) {
      this.buyForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const buy: Buy = {
      idBuys: this.buyId ?? 0,
      idSupplier: this.buyForm.get('idSupplier')?.value,
      purchaseDate: this.buyForm.get('purchaseDate')?.value,
      totalAmount: this.buyForm.get('totalAmount')?.value,
      paymentType: this.buyForm.get('paymentType')?.value
    };

    const details: PurchaseDetail[] = this.details.controls.map(ctrl => ({
      id: ctrl.get('id')?.value,
      idProduct: ctrl.get('idProduct')?.value,
      idBuys: this.buyId ?? 0,
      amount: ctrl.get('amount')?.value,
      subtotal: ctrl.get('subtotal')?.value
    }));

    if (this.buyId) {
      this.buyService.updateBuy(this.buyId, buy).subscribe({
        next: (updatedBuy) => {
          this.saveDetails(details, updatedBuy.idBuys);
        },
        error: () => {
          this.loading = false;
          this.error = 'Error updating buy';
        }
      });
    } else {
      this.buyService.saveBuy(buy).subscribe({
        next: (createdBuy) => {
          this.saveDetails(details, createdBuy.idBuys);
        },
        error: () => {
          this.loading = false;
          this.error = 'Error creating buy';
        }
      });
    }
  }

  saveDetails(details: PurchaseDetail[], buyId: number): void {
    let completed = 0;
    const total = details.length;
    if (total === 0) {
      this.loading = false;
      this.router.navigate(['/admin/buys-list']);
      return;
    }

    details.forEach(detail => {
      detail.idBuys = buyId;
      if (detail.id) {
        this.detailService.updateDetail(detail.id, detail).subscribe({
          next: () => {
            completed++;
            if (completed === total) {
              this.loading = false;
              this.router.navigate(['/admin/buys-list']);
            }
          },
          error: () => {
            this.loading = false;
            this.error = 'Error updating purchase details';
          }
        });
      } else {
        this.detailService.saveDetail(detail).subscribe({
          next: () => {
            completed++;
            if (completed === total) {
              this.loading = false;
              this.router.navigate(['/admin/buys-list']);
            }
          },
          error: () => {
            this.loading = false;
            this.error = 'Error saving purchase details';
          }
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/buys-list']);
  }
}
