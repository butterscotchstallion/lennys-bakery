import { Injectable } from '@angular/core';
import { getApiUrl } from './ApiService';
import { Observable, Subscriber } from 'rxjs';
import { ICart } from '../models/ICart';
import { IAddToCartItem } from '../models/IAddToCartItem';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly apiUrl = getApiUrl('cart');

  constructor() {}

  addItemToCart(item: IAddToCartItem) {
    return fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
  }

  /**
   * Fetch current user's cart
   * @returns Observable<ICart[]> - An observable of the product list.
   */
  getUserCart(): Observable<ICart[]> {
    return new Observable((observer: Subscriber<ICart[]>) => {
      fetch(this.apiUrl)
        .then((response: Response): Promise<ICart[]> => {
          if (!response.ok) {
            throw new Error(
              `Failed to fetch user cart: ${response.status} ${response.statusText}`,
            );
          }
          return response.json(); // Convert the response to JSON
        })
        .then((data: ICart[]) => {
          observer.next(data); // Emit the product data
          observer.complete(); // Complete the observable
        })
        .catch((error) => {
          observer.error(error); // Propagate any errors
        });
    });
  }
}
