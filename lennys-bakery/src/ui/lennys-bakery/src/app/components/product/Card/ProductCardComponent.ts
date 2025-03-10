import { Component, DestroyRef, inject, Input } from "@angular/core";
import { Button } from "primeng/button";
import {
    FaIconComponent,
    IconDefinition,
} from "@fortawesome/angular-fontawesome";
import {
    faBoltLightning,
    faCartPlus,
    faComments,
} from "@fortawesome/free-solid-svg-icons";
import { IProduct } from "../../../models/IProduct";
import { CartService } from "../../../services/CartService";
import { IAddToCartItem } from "../../../models/IAddToCartItem";
import { MessageService } from "primeng/api";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ICart } from "../../../models/ICart";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ProductImageComponent } from "../ProductImage/ProductImageComponent";

@Component({
    selector: "app-product",
    templateUrl: "./ProductCardComponent.html",
    imports: [
        Button,
        FaIconComponent,
        RouterLink,
        CommonModule,
        ProductImageComponent,
    ],
    styleUrls: ["./ProductCardComponent.scss"],
})
export class ProductCardComponent {
    @Input() product: IProduct;
    @Input() cartMap: Map<number, ICart>;
    isLoading = false;
    showTags: boolean = false;
    protected readonly faComments: IconDefinition = faComments;
    protected readonly faCartPlus: IconDefinition = faCartPlus;
    protected readonly faBoltLightning = faBoltLightning;
    private destroyRef: DestroyRef = inject(DestroyRef);

    constructor(
        private cartService: CartService,
        private messageService: MessageService,
    ) {}

    showTagsToggle() {
        this.showTags = !this.showTags;
    }

    getCartQuantity(productId: number): string {
        const cartItem: ICart | undefined = this.cartMap.get(productId);
        return cartItem ? cartItem.quantity.toString() : "0";
    }

    addToCart(product: IProduct) {
        this.isLoading = true;
        const cartItem: IAddToCartItem = {
            inventoryItemId: product.id,
            quantity: 1,
            overwriteQuantity: false,
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
