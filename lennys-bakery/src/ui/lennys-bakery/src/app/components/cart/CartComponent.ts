import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { Button } from 'primeng/button';
import {
  FaIconComponent,
  IconDefinition,
} from '@fortawesome/angular-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Drawer } from 'primeng/drawer';
import { TableModule } from 'primeng/table';
import { Subject } from 'rxjs';
import { ICart } from '../../models/ICart';
import { CartService } from '../../services/CartService';
import { CommonModule } from '@angular/common';
import { ProgressSpinner } from 'primeng/progressspinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';

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
    Select,
    FormsModule,
  ],
  styleUrls: ['CartComponent.scss'],
})
export class CartComponent implements OnInit {
  cartSubtotal: number = 0;
  cartDrawerVisible = false;
  cartItems$: Subject<ICart[]> = new Subject();
  error: string | null = null;
  quantityOptions: any[] = [];
  protected readonly faShoppingCart: IconDefinition = faShoppingCart;
  private destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private cartService: CartService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.fetchCart();
    this.cartService.cartUpdates$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cart: ICart[]) => {
        this.cartItems$.next(cart);
        this.recalculateSubtotal(cart);
      });
    this.quantityOptions = Array.from({ length: 50 }, (_, i) => ({
      label: String(i + 1),
      value: i + 1,
    }));
  }

  recalculateSubtotal(cartItems: ICart[]) {
    this.cartSubtotal = cartItems.reduce(
      (acc: number, item: ICart) =>
        acc + item.inventoryItem.price * item.quantity,
      0,
    );
  }

  fetchCart() {
    this.cartService
      .getUserCart()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (cart: ICart[]) => {
          this.cartItems$.next(cart);
          this.recalculateSubtotal(cart);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch cart',
          });
        },
      });

    /*.pipe(
    tap((cart: ICart[]) => {
      this.recalculateSubtotal(cart);
    }),
    catchError((err) => {
      console.error('Error fetching products:', err);
      this.error = 'Failed to load products. Please try again later.';
      return of([]);
    }),
  );*/
  }
}
