import { Component, Input } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-product',
  templateUrl: './productCardComponent.html',
  imports: [
    NgOptimizedImage
  ],
  styleUrls: ['./productCardStyles.css']
})
export class ProductComponent {
  @Input() productName: string = '';
  @Input() productPrice: number = 0;
  @Input() productDescription: string = '';

  constructor() {}
}
