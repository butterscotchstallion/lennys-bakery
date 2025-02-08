import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Button } from 'primeng/button';
import {
  FaIconComponent,
  IconDefinition,
} from '@fortawesome/angular-fontawesome';
import { faCartPlus, faComments } from '@fortawesome/free-solid-svg-icons';
import { IProduct } from '../../models/IProduct';
import { CartService } from '../../services/CartService';
import { IAddToCartItem } from '../../models/IAddToCartItem';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product',
  templateUrl: './productCardComponent.html',
  imports: [NgOptimizedImage, Button, FaIconComponent],
  styleUrls: ['./productCardStyles.scss'],
})
export class ProductComponent {
  @Input() product: IProduct;
  isLoading = false;
  protected readonly faComments: IconDefinition = faComments;
  protected readonly faCartPlus: IconDefinition = faCartPlus;

  constructor(
    private cartService: CartService,
    private messageService: MessageService,
  ) {}

  addToCart(product: IProduct) {
    this.isLoading = true;
    const cartItem: IAddToCartItem = {
      inventoryItemId: product.id,
      quantity: 1,
    };
    this.cartService
      .addItemToCart(cartItem)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Item added to cart',
        });
      })
      .catch((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add item to cart',
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
