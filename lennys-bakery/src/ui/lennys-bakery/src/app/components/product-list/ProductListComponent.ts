import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ProductService } from '../../services/ProductService';
import { IProduct } from '../../models/IProduct';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ProductComponent } from '../product/ProductComponent';

@Component({
  selector: 'app-product-list',
  templateUrl: './ProductListComponent.html',
  styleUrls: [],
  imports: [NgIf, NgForOf, ProductComponent, AsyncPipe],
})
export class ProductListComponent implements OnInit {
  products$: Observable<IProduct[]> = of([]);
  error: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetchProducts();
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
