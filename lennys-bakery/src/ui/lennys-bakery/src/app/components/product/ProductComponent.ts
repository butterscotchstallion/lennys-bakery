import { Component, Input } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {Button} from 'primeng/button';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

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
}
