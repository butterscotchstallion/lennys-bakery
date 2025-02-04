import { Component, Input } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-product',
  templateUrl: './productCardComponent.html',
  imports: [
    NgOptimizedImage,
    Button
  ],
  styleUrls: ['./productCardStyles.css']
})
export class ProductComponent {
  @Input() productName: string = '';
  @Input() productPrice: number = 0;
  @Input() productDescription: string = '';

  constructor() {}
}
