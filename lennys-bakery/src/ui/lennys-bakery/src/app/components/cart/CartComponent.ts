import { Component, OnInit } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { Button } from 'primeng/button';
import {
  FaIconComponent,
  IconDefinition,
} from '@fortawesome/angular-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Drawer } from 'primeng/drawer';
import { TableModule } from 'primeng/table';
import { catchError, Observable, of } from 'rxjs';
import { ICart } from '../../models/ICart';
import { CartService } from '../../services/CartService';
import { CommonModule } from '@angular/common';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-cart',
  templateUrl: './CartComponent.html',
  imports: [
    MenuModule,
    Button,
    FaIconComponent,
    Drawer,
    TableModule,
    CommonModule,
    ProgressSpinner,
  ],
  styleUrls: ['CartComponent.scss'],
})
export class CartComponent implements OnInit {
  cartDrawerVisible = false;
  cartItems$: Observable<ICart[]> = of([]);
  error: string | null = null;
  protected readonly faShoppingCart: IconDefinition = faShoppingCart;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.fetchCart();
  }

  fetchCart() {
    this.cartItems$ = this.cartService.getUserCart().pipe(
      catchError((err) => {
        console.error('Error fetching products:', err);
        this.error = 'Failed to load products. Please try again later.';
        return of([]);
      }),
    );
  }
}
