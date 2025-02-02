import { Component } from '@angular/core';
import {ProductService} from '../../services/ProductService';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products: Observable<IProduct[]> = [];

  ngOnInit() {
    this.products = this.productService.getProducts();
  }

  constructor(private productService: ProductService) {}
}
