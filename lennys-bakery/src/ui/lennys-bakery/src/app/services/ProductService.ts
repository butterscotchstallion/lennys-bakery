import { Injectable } from "@angular/core";
import { Observable, Subject, Subscriber } from "rxjs";
import { IProduct } from "../models/IProduct";
import { getApiUrl } from "./ApiService";
import { ITag } from "../models/ITag";

@Injectable({
    providedIn: "root",
})
export class ProductService {
    private readonly apiUrl = getApiUrl("inventory");

    constructor() {}

    updateProduct(product: IProduct, itemSlug: string) {
        const product$ = new Subject<IProduct>();

        fetch(this.apiUrl + "/item/" + itemSlug, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        }).then((response: Response) => {
            if (response.ok) {
                product$.next(product);
            } else {
                product$.error(response.body);
            }
        });

        return product$;
    }

    getProductBySlug(slug: string): Subject<IProduct> {
        const product$ = new Subject<IProduct>();
        fetch(this.apiUrl + "/item/" + slug)
            .then((response: Response) => {
                if (response.ok) {
                    response.json().then((product: IProduct) => {
                        product$.next(product);
                    });
                } else {
                    product$.error(response.body);
                }
            })
            .catch((error) => {
                product$.error(error);
            });
        return product$;
    }

    /**
     * Fetch all products from the API
     * @returns Observable<IProduct[]> - An observable of the product list.
     */
    getProducts(): Observable<IProduct[]> {
        return new Observable((observer: Subscriber<IProduct[]>) => {
            fetch(this.apiUrl)
                .then((response: Response): Promise<IProduct[]> => {
                    if (!response.ok) {
                        throw new Error(
                            `Failed to fetch products: ${response.status} ${response.statusText}`,
                        );
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

    getProductsWithTags(tags: ITag[]): Subject<IProduct[]> {
        const products$ = new Subject<IProduct[]>();

        fetch(this.apiUrl + "/search/tags", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tags: tags,
            }),
        }).then((response: Response) => {
            if (response.ok) {
                response.json().then((products: IProduct[]) => {
                    products$.next(products);
                });
            } else {
                products$.error(response.body);
            }
        });

        return products$;
    }
}
