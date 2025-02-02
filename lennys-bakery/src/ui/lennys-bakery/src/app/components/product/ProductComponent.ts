import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './productCardComponent.html',
  styleUrls: ['./productCardStyles.css']
})
export class ProductComponent {
  @Input() productName: string = '';
  @Input() productPrice: number = 0;
  @Input() productDescription: string = '';

  constructor() {}
}
