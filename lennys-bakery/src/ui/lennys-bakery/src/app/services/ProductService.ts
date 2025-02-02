import { Injectable } from '@angular/core';
import {Observable, Subscriber} from 'rxjs';
import {IProduct} from '../models/IProduct';
import {getApiUrl} from './ApiService';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = getApiUrl('inventory');

  constructor() {}

  /**
   * Fetch all products from the API
   * @returns Observable<IProduct[]> - An observable of the product list.
   */
  getProducts(): Observable<IProduct[]> {
    return new Observable((observer: Subscriber<IProduct[]>) => {
      fetch(this.apiUrl)
        .then((response: Response): Promise<IProduct[]> => {
          if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
          }
          return response.json(); // Convert the response to JSON
        })
        .then((data: IProduct[]) => {
          observer.next(data); // Emit the product data
          observer.complete(); // Complete the observable
        })
        .catch((error) => {
          observer.error(error); // Propagate any errors
        });
    });
  }
}
