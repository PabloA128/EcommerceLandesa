import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  activa: boolean;
  fechaCreacion: Date;
  cantidadSubcategorias: number;
  cantidadArticulos: number;
}

export interface Subcategoria {
  id: number;
  nombre: string;
  descripcion?: string;
  activa: boolean;
  fechaCreacion: Date;
  categoriaId: number;
  categoriaNombre: string;
  cantidadArticulos: number;
}

export interface Articulo {
  id: number;
  codigoArticulo: string;
  nombre: string;
  descripcion?: string;
  precioUsuario: number;
  precioTaller: number;
  stock: number;
  imagen?: string;
  activo: boolean;
  fechaCreacion: Date;
  categoriaId: number;
  categoriaNombre: string;
  subcategoriaId?: number;
  subcategoriaNombre?: string;
  tallerIds: number[];
}

export interface BusquedaRequest {
  termino?: string;
  categoriaId?: number;
  subcategoriaId?: number;
  precioMin?: number;
  precioMax?: number;
  soloConStock: boolean;
  pagina: number;
  tamanoPagina: number;
}

@Injectable({
  providedIn: 'root'
})
export class EcommerceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Categorías
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`);
  }

  getCategoriasActivas(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias/activas`);
  }

  getCategoriaById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/categorias/${id}`);
  }

  // Subcategorías
  getSubcategorias(): Observable<Subcategoria[]> {
    return this.http.get<Subcategoria[]>(`${this.apiUrl}/subcategorias`);
  }

  getSubcategoriasActivas(): Observable<Subcategoria[]> {
    return this.http.get<Subcategoria[]>(`${this.apiUrl}/subcategorias/activas`);
  }

  getSubcategoriasByCategoria(categoriaId: number): Observable<Subcategoria[]> {
    return this.http.get<Subcategoria[]>(`${this.apiUrl}/subcategorias/categoria/${categoriaId}`);
  }

  getSubcategoriasActivasByCategoria(categoriaId: number): Observable<Subcategoria[]> {
    return this.http.get<Subcategoria[]>(`${this.apiUrl}/subcategorias/categoria/${categoriaId}/activas`);
  }

  // Artículos
  getArticulos(): Observable<Articulo[]> {
    return this.http.get<Articulo[]>(`${this.apiUrl}/articulos`);
  }

  getArticuloById(id: number): Observable<Articulo> {
    return this.http.get<Articulo>(`${this.apiUrl}/articulos/${id}`);
  }

  getArticuloByCodigo(codigo: string): Observable<Articulo> {
    return this.http.get<Articulo>(`${this.apiUrl}/articulos/codigo/${codigo}`);
  }

  getArticulosActivos(): Observable<Articulo[]> {
    return this.http.get<Articulo[]>(`${this.apiUrl}/articulos/activos`);
  }

  getArticulosByCategoria(categoriaId: number): Observable<Articulo[]> {
    return this.http.get<Articulo[]>(`${this.apiUrl}/articulos/categoria/${categoriaId}`);
  }

  getArticulosBySubcategoria(subcategoriaId: number): Observable<Articulo[]> {
    return this.http.get<Articulo[]>(`${this.apiUrl}/articulos/subcategoria/${subcategoriaId}`);
  }

  buscarArticulos(request: BusquedaRequest): Observable<Articulo[]> {
    return this.http.post<Articulo[]>(`${this.apiUrl}/articulos/buscar`, request);
  }

  getTotalArticulos(request: BusquedaRequest): Observable<number> {
    let params = new HttpParams();
    if (request.termino) params = params.set('termino', request.termino);
    if (request.categoriaId) params = params.set('categoriaId', request.categoriaId.toString());
    if (request.subcategoriaId) params = params.set('subcategoriaId', request.subcategoriaId.toString());
    if (request.precioMin) params = params.set('precioMin', request.precioMin.toString());
    if (request.precioMax) params = params.set('precioMax', request.precioMax.toString());
    if (request.soloConStock) params = params.set('soloConStock', 'true');

    return this.http.get<number>(`${this.apiUrl}/articulos/buscar/count`, { params });
  }
}
