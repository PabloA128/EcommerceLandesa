import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

import { EcommerceService, Categoria, Subcategoria, Articulo, BusquedaRequest } from '../../services/ecommerce.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatBadgeModule,
    MatListModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatMenuModule,
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.css']
})
export class EcommerceComponent implements OnInit {
  categorias: Categoria[] = [];
  subcategorias: Subcategoria[] = [];
  articulos: Articulo[] = [];

  terminoBusqueda: string = '';
  categoriaSeleccionada: number | null = null;
  subcategoriaSeleccionada: number | null = null;
  precioMin: number | null = null;
  precioMax: number | null = null;
  soloConStock: boolean = false;

  paginaActual: number = 1;
  tamanoPagina: number = 12;
  totalArticulos: number = 0;

  isLoading: boolean = false;

  constructor(
    private ecommerceService: EcommerceService,
    private router: Router,
    public cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarArticulos();
  }

  cargarCategorias(): void {
    this.ecommerceService.getCategoriasActivas().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.cargarSubcategorias();
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  cargarSubcategorias(): void {
    this.ecommerceService.getSubcategoriasActivas().subscribe({
      next: (subcategorias) => {
        this.subcategorias = subcategorias;
      },
      error: (error) => {
        console.error('Error al cargar subcategorías:', error);
      }
    });
  }

  cargarArticulos(): void {
    this.isLoading = true;
    const request: BusquedaRequest = {
      termino: this.terminoBusqueda,
      categoriaId: this.categoriaSeleccionada || undefined,
      subcategoriaId: this.subcategoriaSeleccionada || undefined,
      precioMin: this.precioMin || undefined,
      precioMax: this.precioMax || undefined,
      soloConStock: this.soloConStock,
      pagina: this.paginaActual,
      tamanoPagina: this.tamanoPagina
    };

    this.ecommerceService.buscarArticulos(request).subscribe({
      next: (articulos) => {
        this.articulos = articulos;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar artículos:', error);
        this.isLoading = false;
      }
    });

    // Cargar total para paginación
    this.ecommerceService.getTotalArticulos(request).subscribe({
      next: (total) => {
        this.totalArticulos = total;
      },
      error: (error) => {
        console.error('Error al cargar total de artículos:', error);
      }
    });
  }

  buscar(): void {
    this.paginaActual = 1;
    this.cargarArticulos();
  }

  aplicarFiltros(): void {
    this.paginaActual = 1;
    this.cargarArticulos();
  }

  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.categoriaSeleccionada = null;
    this.subcategoriaSeleccionada = null;
    this.precioMin = null;
    this.precioMax = null;
    this.soloConStock = false;
    this.paginaActual = 1;
    this.cargarArticulos();
  }

  onCategoriaChange(categoriaId: number | null): void {
    this.categoriaSeleccionada = categoriaId;
    this.subcategoriaSeleccionada = null;
    this.paginaActual = 1;
    this.cargarArticulos();
  }

  onSubcategoriaChange(subcategoriaId: number): void {
    this.subcategoriaSeleccionada = subcategoriaId;
    this.paginaActual = 1;
    this.cargarArticulos();
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
    this.cargarArticulos();
  }

  onPage(event: PageEvent): void {
    this.paginaActual = event.pageIndex + 1;
    this.tamanoPagina = event.pageSize;
    this.cargarArticulos();
  }

  agregarAlCarrito(articulo: Articulo): void {
    this.cartService.add(articulo, 1);
    
    // Mostrar notificación de éxito
    this.snackBar.open(`✅ ${articulo.nombre} agregado al carrito`, 'Ver carrito', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    }).onAction().subscribe(() => {
      this.goToCart();
    });
  }

  removerDelCarrito(index: number): void {
    const items = this.cartService.getItems();
    if (items[index]) {
      this.cartService.remove(items[index].articulo.id);
    }
  }

  verDetalleArticulo(articulo: Articulo): void {
    this.router.navigate(['/articulo', articulo.id]);
  }

  getSubcategoriasByCategoria(categoriaId: number): Subcategoria[] {
    return this.subcategorias.filter(s => s.categoriaId === categoriaId);
  }

  getTotalCarrito(): number {
    return this.cartService.getTotal();
  }

  getCantidadCarrito(): number {
    return this.cartService.getCount();
  }

  goToCart(): void {
    this.router.navigate(['/carrito']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToOrders(): void {
    // TODO: Implementar componente de órdenes
    console.log('Navegando a órdenes...');
    // Placeholder para futuras órdenes
  }

  logout(): void {
    this.router.navigate(['/']);
  }

  getCategoriaIcon(nombre: string): string {
    const n = nombre.toLowerCase();
    if (n.includes('motor')) return 'settings';
    if (n.includes('trans')) return 'sync_alt';
    if (n.includes('susp')) return 'alt_route';
    if (n.includes('freno')) return 'stop_circle';
    if (n.includes('eléct') || n.includes('elect')) return 'bolt';
    return 'category';
  }

  canAdd(articulo: Articulo): boolean {
    if (articulo.stock <= 0) return false;
    const current = this.cartService.getQuantity(articulo.id);
    return current < articulo.stock;
  }

  onImageError(event: any): void {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04MCA2MEgxMjBWMTQwSDgwVjYwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBkPSJNODAgNjBMMTIwIDEwMEw4MCAxNDBWNjBaIiBmaWxsPSIjRUVFRUVFIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkltYWdlbiBubyBlbmNvbnRyYWRhPC90ZXh0Pgo8L3N2Zz4K';
  }
}
