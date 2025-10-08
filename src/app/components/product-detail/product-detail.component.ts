import { Component, OnInit } from '@angular/core';
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
    MatListModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  articulo: Articulo | null = null;
  articulosRelacionados: Articulo[] = [];
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ecommerceService: EcommerceService,
    public cartService: CartService
  ) {}

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
      this.cartService.add(this.articulo, 1);
    }
  }

  comprarAhora(): void {
    if (this.articulo) {
      if (this.canAdd(this.articulo)) {
        this.agregarAlCarrito();
      }
      // Aquí se debería redirigir al checkout
      alert('¡Redirigiendo al checkout!');
    }
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
    if (this.articulo.stock <= 0) {
      return 'out-of-stock';
    } else if (this.articulo.stock <= 5) {
      return 'low-stock';
    } else {
      return 'in-stock';
    }
  }

  canAdd(a: Articulo): boolean {
    if (!a) return false;
    if (a.stock <= 0) return false;
    const current = this.cartService.getQuantity(a.id);
    return current < a.stock;
  }
}
