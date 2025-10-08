import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ClearCartDialogData {
  itemCount: number;
}

@Component({
  selector: 'app-clear-cart-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <mat-icon class="warning-icon">warning</mat-icon>
        <h2>¿Vaciar carrito?</h2>
      </div>
      
      <div class="dialog-content">
        <p>¿Estás seguro de que quieres eliminar todos los {{ data.itemCount }} {{ data.itemCount === 1 ? 'artículo' : 'artículos' }} del carrito?</p>
        <p class="warning-text">Esta acción no se puede deshacer.</p>
      </div>
      
      <div class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-btn">
          Cancelar
        </button>
        <button mat-raised-button color="warn" (click)="onConfirm()" class="confirm-btn">
          <mat-icon>delete_forever</mat-icon>
          Vaciar carrito
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 24px;
      text-align: center;
    }
    
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    
    .warning-icon {
      font-size: 48px;
      color: #f44336;
    }
    
    .dialog-header h2 {
      margin: 0;
      color: #2c3e50;
      font-weight: 600;
    }
    
    .dialog-content {
      margin-bottom: 24px;
    }
    
    .dialog-content p {
      margin: 8px 0;
      color: #495057;
      line-height: 1.5;
    }
    
    .warning-text {
      color: #f44336 !important;
      font-weight: 600;
    }
    
    .dialog-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    
    .cancel-btn {
      border-radius: 8px !important;
    }
    
    .confirm-btn {
      border-radius: 8px !important;
      font-weight: 600 !important;
    }
  `]
})
export class ClearCartDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ClearCartDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClearCartDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
