import { Component, OnInit } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import {ProductService} from '../../services/ProductService';
import {IProduct} from '../../models/IProduct';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ProductComponent} from '../product/ProductComponent';

@Component({
  selector: 'app-product-list',
  templateUrl: './ProductListComponent.html',
  styleUrls: [],
  imports: [
    NgIf,
    NgForOf,
    ProductComponent,
    AsyncPipe
  ]
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
      catchError((err) => {
        console.error('Error fetching products:', err);
        this.error = 'Failed to load products. Please try again later.';
        return of([]); // Return an observable with an empty array if there's an error
      })
    );
  }
}
