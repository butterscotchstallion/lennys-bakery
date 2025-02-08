import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ProductService } from '../../services/ProductService';
import { IProduct } from '../../models/IProduct';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ProductComponent } from '../product/ProductComponent';
import { ICart } from '../../models/ICart';
import { CartService } from '../../services/CartService';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-list',
  templateUrl: './ProductListComponent.html',
  styleUrls: [],
  imports: [NgIf, NgForOf, ProductComponent, AsyncPipe],
})
export class ProductListComponent implements OnInit {
  products$: Observable<IProduct[]> = of([]);
  error: string | null = null;
  cartMap: Map<number, ICart> = new Map();
  private destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private productService: ProductService,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    this.fetchProducts();
    this.cartService.cartMapUpdates$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cartMap: Map<number, ICart>) => {
        this.cartMap = cartMap;
      });
  }

  fetchProducts() {
    this.products$ = this.productService.getProducts().pipe(
      map((products: IProduct[]) => {
        return products.map((product) => ({
          ...product,
          numReviews: Math.floor(Math.random() * 50) + 1,
        }));
      }),
      catchError((err) => {
        console.error('Error fetching products:', err);
        this.error = 'Failed to load products. Please try again later.';
        return of([]);
      }),
    );
  }
}
