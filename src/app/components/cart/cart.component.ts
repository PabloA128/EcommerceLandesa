import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

import { CartService, CartItem } from '../../services/cart.service';
import { ClearCartDialogComponent } from './clear-cart-dialog.component';
import { CheckoutDialogComponent } from './checkout-dialog.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.cartService.getItemsObservable().subscribe(items => {
      this.items = items;
    });
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  increase(item: CartItem): void {
    this.cartService.updateQuantity(item.articulo.id, item.quantity + 1);
  }

  decrease(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.articulo.id, item.quantity - 1);
    }
  }

  remove(item: CartItem): void {
    this.cartService.remove(item.articulo.id);
  }

  clear(): void {
    const dialogRef = this.dialog.open(ClearCartDialogComponent, {
      width: '400px',
      data: { itemCount: this.items.length }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cartService.clear();
        this.snackBar.open('✅ Carrito vaciado exitosamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  seguirComprando(): void {
    this.router.navigate(['/ecommerce']);
  }

  checkout(): void {
    const dialogRef = this.dialog.open(CheckoutDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { 
        total: this.getTotal(), 
        itemCount: this.items.length 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Limpiar carrito después del checkout exitoso
        this.cartService.clear();
      }
    });
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/no-image.svg';
  }
}
