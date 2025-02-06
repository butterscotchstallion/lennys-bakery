import { Component, Input } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {Button} from 'primeng/button';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import { faComments, faCartPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product',
  templateUrl: './productCardComponent.html',
  imports: [
    NgOptimizedImage,
    Button,
    FaIconComponent
  ],
  styleUrls: ['./productCardStyles.scss']
})
export class ProductComponent {
  @Input() productName: string = '';
  @Input() productPrice: number = 0;
  @Input() productDescription: string = '';

  constructor() {}

  protected readonly faComments = faComments;

  getRandomNumberOfReviews() {
    return ~~(Math.random() * 50) + 1;
  }

  protected readonly faCartPlus = faCartPlus;
}
