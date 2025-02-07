import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Button } from 'primeng/button';
import {
  FaIconComponent,
  IconDefinition,
} from '@fortawesome/angular-fontawesome';
import { faCartPlus, faComments } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product',
  templateUrl: './productCardComponent.html',
  imports: [NgOptimizedImage, Button, FaIconComponent],
  styleUrls: ['./productCardStyles.scss'],
})
export class ProductComponent {
  @Input() productName: string = '';
  @Input() productPrice: number = 0;
  @Input() productDescription: string = '';
  @Input() productNumReviews: number = 0;
  protected readonly faComments: IconDefinition = faComments;
  protected readonly faCartPlus: IconDefinition = faCartPlus;

  constructor() {}
}
