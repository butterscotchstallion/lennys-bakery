import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = '/api/v1/inventory';

  constructor() {}

  /**
   * Fetch all products from the API
   * @returns Observable<IProduct[]> - An observable of the product list.
   */
  getProducts(): Observable<IProduct[]> {
    return new Observable((observer) => {
      fetch(this.apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
          }
          return response.json(); // Convert the response to JSON
        })
        .then((data) => {
          observer.next(data); // Emit the product data
          observer.complete(); // Complete the observable
        })
        .catch((error) => {
          observer.error(error); // Propagate any errors
        });
    });
  }
}
