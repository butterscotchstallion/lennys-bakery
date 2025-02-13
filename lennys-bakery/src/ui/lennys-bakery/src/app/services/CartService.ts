import { DestroyRef, inject, Injectable } from "@angular/core";
import { getApiUrl } from "./ApiService";
import { debounceTime, Subject } from "rxjs";
import { ICart } from "../models/ICart";
import { IAddToCartItem } from "../models/IAddToCartItem";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Injectable({
    providedIn: "root",
})
export class CartService {
    cartUpdates$: Subject<ICart[]> = new Subject<ICart[]>();
    cartMapUpdates$: Subject<Map<number, ICart>> = new Subject<
        Map<number, ICart>
    >();
    private readonly apiUrl = getApiUrl("cart");
    private destroyRef: DestroyRef = inject(DestroyRef);

    constructor() {}

    addItemToCart(item: IAddToCartItem) {
        const cart$ = new Subject();
        fetch(this.apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
        })
            .then((response: Response) => {
                if (response.ok) {
                    cart$.next(response.body);

                    // Update cart observers
                    this.getUserCart()
                        .pipe(
                            debounceTime(1500),
                            takeUntilDestroyed(this.destroyRef),
                        )
                        .subscribe((cart) => {
                            this.cartUpdates$.next(cart);
                        });
                } else {
                    cart$.error(response.body);
                }
            })
            .catch((error) => {
                cart$.error(error);
            });
        return cart$;
    }

    getProductMapFromCart(cart: ICart[]) {
        const cartMap = new Map<number, ICart>();
        cart.map((cartItem: ICart) => {
            cartMap.set(cartItem.inventoryItem.id, cartItem);
        });
        return cartMap;
    }

    /**
     * Fetch current user's cart
     * @returns Subject<ICart[]> - An observable of the product list.
     */
    getUserCart(): Subject<ICart[]> {
        const subject = new Subject<ICart[]>();

        fetch(this.apiUrl)
            .then((response: Response) => {
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch user cart: ${response.status} ${response.statusText}`,
                    );
                }
                return response.json();
            })
            .then((cart: ICart[]) => {
                this.cartUpdates$.next(cart);
                this.cartMapUpdates$.next(this.getProductMapFromCart(cart));
                subject.next(cart);
                subject.complete();
            })
            .catch((error) => {
                subject.error(error);
            });

        return subject;
    }

    removeFromCart(cartItem: ICart) {
        const cart$ = new Subject();
        fetch(this.apiUrl + "/" + cartItem.id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response: Response) => {
            if (response.ok) {
                cart$.next(response.body);
            } else {
                cart$.error(response.body);
            }
        });
        return cart$;
    }
}
