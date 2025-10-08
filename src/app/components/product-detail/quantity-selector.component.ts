import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './quantity-selector.component.html',
  styleUrl: './quantity-selector.component.css'
})
export class QuantitySelectorComponent implements OnChanges {
  @Input() maxQuantity: number = 0;
  @Input() initialQuantity: number = 1;
  @Output() quantityChange = new EventEmitter<number>();

  quantity: number = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialQuantity'] && changes['initialQuantity'].currentValue !== undefined) {
      this.quantity = Math.max(1, Math.min(changes['initialQuantity'].currentValue, this.maxQuantity));
    }
    if (changes['maxQuantity']) {
      // Ajustar cantidad si excede el nuevo máximo
      if (this.quantity > this.maxQuantity) {
        this.quantity = Math.max(1, this.maxQuantity);
        this.quantityChange.emit(this.quantity);
      }
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.quantityChange.emit(this.quantity);
    }
  }

  increaseQuantity(): void {
    if (this.quantity < this.maxQuantity) {
      this.quantity++;
      this.quantityChange.emit(this.quantity);
    }
  }

  onQuantityInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);

    if (!isNaN(value) && value >= 1 && value <= this.maxQuantity) {
      this.quantity = value;
      this.quantityChange.emit(this.quantity);
    } else {
      // Restaurar el valor anterior si es inválido
      input.value = this.quantity.toString();
    }
  }
}
