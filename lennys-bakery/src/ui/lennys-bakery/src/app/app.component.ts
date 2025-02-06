import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCartPlus,
  faCartShopping,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { CartComponent } from './components/cart/CartComponent';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FontAwesomeModule, CartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'lennys-bakery';
  protected readonly faCartPlus = faCartPlus;
  protected readonly faCartShopping = faCartShopping;
  protected readonly faChevronDown = faChevronDown;
}
