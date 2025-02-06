import { Component } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { Button } from 'primeng/button';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Drawer } from 'primeng/drawer';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-cart',
  templateUrl: './CartComponent.html',
  imports: [MenuModule, Button, FaIconComponent, Drawer, TableModule],
})
export class CartComponent {
  cartDrawerVisible = false;
  cartItems: any[] = [{ name: 'Treat #1', quantity: 1, price: 3.9 }];
  protected readonly faShoppingCart = faShoppingCart;
}
