import { Component, DestroyRef, inject, Input } from "@angular/core";
import { NgClass, NgOptimizedImage } from "@angular/common";
import { Button } from "primeng/button";
import {
    FaIconComponent,
    IconDefinition,
} from "@fortawesome/angular-fontawesome";
import { faCartPlus, faComments } from "@fortawesome/free-solid-svg-icons";
import { IProduct } from "../../models/IProduct";
import { CartService } from "../../services/CartService";
import { IAddToCartItem } from "../../models/IAddToCartItem";
import { MessageService } from "primeng/api";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ICart } from "../../models/ICart";

@Component({
    selector: "app-product",
    templateUrl: "./productCardComponent.html",
    imports: [NgOptimizedImage, Button, FaIconComponent, NgClass],
    styleUrls: ["./productCardStyles.scss"],
})
export class ProductComponent {
    @Input() product: IProduct;
    @Input() cartMap: Map<number, ICart>;
    isLoading = false;
    protected readonly faComments: IconDefinition = faComments;
    protected readonly faCartPlus: IconDefinition = faCartPlus;
    private destroyRef: DestroyRef = inject(DestroyRef);

    constructor(
        private cartService: CartService,
        private messageService: MessageService,
    ) {}

    getCartQuantity(productId: number): string {
        const cartItem: ICart | undefined = this.cartMap.get(productId);
        return cartItem ? cartItem.quantity.toString() : "0";
    }

    addToCart(product: IProduct) {
        this.isLoading = true;
        const cartItem: IAddToCartItem = {
            inventoryItemId: product.id,
            quantity: 1,
        };
        this.cartService
            .addItemToCart(cartItem)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: "success",
                        summary: "Success",
                        detail: product.name + " added to cart",
                    });
                    this.isLoading = false;
                },
                error: () => {
                    this.messageService.add({
                        severity: "error",
                        summary: "Error",
                        detail: "Failed to add " + product.name + " to cart",
                    });
                    this.isLoading = false;
                },
            });
    }
}
