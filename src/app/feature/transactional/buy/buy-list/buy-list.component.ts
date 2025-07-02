import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { Buy } from '../../../../core/interfaces/buy-interfaces';
import { BuyService } from '../../../../core/services/buy.service';

@Component({
  selector: 'app-buys-list',
  templateUrl: '../buy-list/buy-list.component.html',
  styleUrls: ['../buy-list/buy-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class BuysListComponent implements OnInit {
  buys: Buy[] = [];
  loading = false;
  error = '';

  // Agregamos 'paymentType' para que coincida con el HTML
  displayedColumns: string[] = ['id', 'supplier', 'purchaseDate', 'totalAmount', 'paymentType', 'actions'];

  constructor(private buyService: BuyService, private router: Router) {}

  ngOnInit(): void {
    this.loadBuys();
  }

  loadBuys(): void {
    this.loading = true;
    this.buyService.getBuys().subscribe({
      next: (data) => {
        this.buys = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error loading buys';
        this.loading = false;
      }
    });
  }

  goToForm(id?: number): void {
    if (id) {
      this.router.navigate(['/admin/buys/form', id]);
    } else {
      this.router.navigate(['/admin/buys/form']);
    }
  }

  deleteBuy(id: number): void {
    if (confirm('Are you sure you want to delete this buy?')) {
      this.buyService.deleteBuy(id).subscribe(() => {
        this.loadBuys();
      });
    }
  }
}
