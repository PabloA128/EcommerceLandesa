import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

import { EcommerceService, Articulo } from '../../services/ecommerce.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { QuantitySelectorComponent } from './quantity-selector.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule,
    QuantitySelectorComponent
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  articulo: Articulo | null = null;
  articulosRelacionados: Articulo[] = [];
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ecommerceService: EcommerceService,
    public cartService: CartService,
    private authService: AuthService
  ) {}

  selectedQuantity: number = 1;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarArticulo(parseInt(id));
    }
  }

  cargarArticulo(id: number): void {
    this.isLoading = true;
    this.ecommerceService.getArticuloById(id).subscribe({
      next: (articulo) => {
        this.articulo = articulo;
        this.cargarArticulosRelacionados();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar artículo:', error);
        this.isLoading = false;
      }
    });
  }

  cargarArticulosRelacionados(): void {
    if (this.articulo) {
      this.ecommerceService.getArticulosByCategoria(this.articulo.categoriaId).subscribe({
        next: (articulos) => {
          this.articulosRelacionados = articulos
            .filter(a => a.id !== this.articulo!.id)
            .slice(0, 4);
        },
        error: (error) => {
          console.error('Error al cargar artículos relacionados:', error);
        }
      });
    }
  }

  agregarAlCarrito(): void {
    if (this.articulo) {
      this.cartService.add(this.articulo, this.selectedQuantity);
    }
  }

  comprarAhora(): void {
    if (this.articulo) {
      if (this.canAddToCart()) {
        this.agregarAlCarrito();
      }
      // Aquí se debería redirigir al checkout
      alert('¡Redirigiendo al checkout!');
    }
  }

  onQuantityChange(quantity: number): void {
    this.selectedQuantity = quantity;
  }

  isWorkshopUser(): boolean {
    const user = this.authService.getCurrentUser();
    return user ? user.taller : false;
  }

  getDisplayPrice(): number {
    if (!this.articulo) return 0;
    return this.isWorkshopUser() ? this.articulo.precioTaller : this.articulo.precioUsuario;
  }

  getPriceClass(): string {
    return this.isWorkshopUser() ? 'workshop-price' : 'user-price';
  }

  getStockIcon(): string {
    if (!this.articulo) return 'report_problem';
    if (this.articulo.stock <= 0) return 'report_problem';
    if (this.articulo.stock <= 5) return 'warning';
    return 'inventory';
  }

  canAddToCart(): boolean {
    if (!this.articulo) return false;
    if (!this.articulo.activo) return false;
    if (this.articulo.stock <= 0) return false;
    const current = this.cartService.getQuantity(this.articulo.id);
    return (current + this.selectedQuantity) <= this.articulo.stock;
  }

  verArticuloRelacionado(articulo: Articulo): void {
    this.router.navigate(['/articulo', articulo.id]);
  }

  volverALista(): void {
    this.router.navigate(['/ecommerce']);
  }

  goToCategoria(categoriaId: number): void {
    this.router.navigate(['/ecommerce'], { queryParams: { categoriaId } });
  }

  goToSubcategoria(subcategoriaId: number | undefined): void {
    if (subcategoriaId != null) {
      this.router.navigate(['/ecommerce'], { queryParams: { subcategoriaId } });
    }
  }

  getStockStatus(): string {
    if (!this.articulo) return '';
    if (!this.articulo.activo) return 'Producto no disponible';
    if (this.articulo.stock <= 0) {
      return 'Sin stock';
    } else if (this.articulo.stock <= 5) {
      return 'Stock bajo';
    } else {
      return 'En stock';
    }
  }

  getStockClass(): string {
    if (!this.articulo) return '';
    if (!this.articulo.activo) return 'product-unavailable';
    if (this.articulo.stock <= 0) {
      return 'out-of-stock';
    } else if (this.articulo.stock <= 5) {
      return 'low-stock';
    } else {
      return 'in-stock';
    }
  }

  canAdd(a: Articulo): boolean {
    return this.canAddToCart();
  }

  // Manejo de errores de imagen
  onImageError(event: any): void {
    event.target.src = '/assets/images/no-image.svg';
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }
}
