import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Articulo } from './ecommerce.service';

export interface CartItem {
  articulo: Articulo;
  quantity: number;
}

const STORAGE_KEY = 'cart_items_v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: CartItem[] = [];
  private items$ = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    this.load();
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    this.items$.next([...this.items]);
  }

  private load(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        this.items = JSON.parse(raw) as CartItem[];
      } catch {
        this.items = [];
      }
    }
    this.items$.next([...this.items]);
  }

  getItemsObservable() {
    return this.items$.asObservable();
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  getCount(): number {
    return this.items.reduce((acc, it) => acc + it.quantity, 0);
  }

  getTotal(): number {
    return this.items.reduce((acc, it) => acc + it.articulo.precioUsuario * it.quantity, 0);
  }

  getQuantity(articuloId: number): number {
    const item = this.items.find(i => i.articulo.id === articuloId);
    return item ? item.quantity : 0;
  }

  add(articulo: Articulo, quantity: number = 1): void {
    if (articulo.stock <= 0) return;
    const idx = this.items.findIndex(i => i.articulo.id === articulo.id);
    if (idx >= 0) {
      const current = this.items[idx].quantity;
      const desired = Math.min(current + quantity, articulo.stock);
      this.items[idx].quantity = desired;
    } else {
      const initialQty = Math.min(quantity, articulo.stock);
      this.items.push({ articulo, quantity: initialQty });
    }
    this.save();
  }

  remove(articuloId: number): void {
    this.items = this.items.filter(i => i.articulo.id !== articuloId);
    this.save();
  }

  updateQuantity(articuloId: number, quantity: number): void {
    const item = this.items.find(i => i.articulo.id === articuloId);
    if (!item) return;
    const max = item.articulo.stock;
    const bounded = Math.min(Math.max(1, quantity), max > 0 ? max : 1);
    item.quantity = bounded;
    this.save();
  }

  clear(): void {
    this.items = [];
    this.save();
  }
}
