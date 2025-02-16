import { Component, DestroyRef, inject, Input, OnInit } from "@angular/core";
import { Select } from "primeng/select";
import { FormsModule } from "@angular/forms";
import { catchError, noop, throwError } from "rxjs";
import { ICart } from "../../../models/ICart";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CartService } from "../../../services/CartService";
import { MessageService } from "primeng/api";

@Component({
    selector: "app-product-quantity-selector",
    templateUrl: "./ProductQuantitySelectorComponent.html",
    imports: [Select, FormsModule],
})
export class ProductQuantitySelectorComponent implements OnInit {
    @Input() onChange = noop;
    maxQuantity: number = 50;
    quantityOptions: any[] = [];
    itemQuantity: number = 1;
    private destroyRef: DestroyRef = inject(DestroyRef);

    constructor(
        private cartService: CartService,
        private messageService: MessageService,
    ) {}

    onQuantityChange(cartItem: ICart) {
        this.cartService
            .addItemToCart({
                inventoryItemId: cartItem.inventoryItem.id,
                quantity: cartItem.quantity,
                overwriteQuantity: true,
            })
            .pipe(
                catchError(() => {
                    this.messageService.add({
                        severity: "error",
                        summary: "Error",
                        detail: "There was a problem updating your cart.",
                    });
                    return throwError(() => "Failed to update cart");
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(() => {
                this.messageService.add({
                    severity: "success",
                    summary: "Success",
                    detail: "Cart updated",
                });
            });
    }

    ngOnInit() {
        this.quantityOptions = Array.from(
            { length: this.maxQuantity },
            (_, i) => ({
                label: String(i + 1),
                value: i + 1,
            }),
        );
    }
}
