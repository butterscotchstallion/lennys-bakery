import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { IProduct } from "../../models/IProduct";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ProductService } from "../../services/ProductService";
import { ProgressSpinner } from "primeng/progressspinner";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { catchError } from "rxjs";
import { Message } from "primeng/message";
import { FormsModule } from "@angular/forms";
import { ProductImageComponent } from "../../components/product/ProductImage/ProductImageComponent";
import { Button } from "primeng/button";
import { faBoltLightning, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import {
    FaIconComponent,
    IconDefinition,
} from "@fortawesome/angular-fontawesome";
import { Rating } from "primeng/rating";
import { Card } from "primeng/card";
import { StockStatusIndicatorComponent } from "../../components/StockStatusIndicator/StockStatusIndicatorComponent";
import { ProductReviewsSummaryComponent } from "../../components/product/Reviews/Summary/ProductReviewsSummaryComponent";
import { ProductReviewsListComponent } from "../../components/product/Reviews/List/ProductReviewsListComponent";
import { RelatedProductListComponent } from "../../components/product/RelatedProductList/RelatedProductListComponent";
import { Tag } from "primeng/tag";
import { ProductQuantitySelectorComponent } from "../../components/product/ProductQuantity/ProductQuantitySelectorComponent";
import { IAddToCartItem } from "../../models/IAddToCartItem";
import { MessageService } from "primeng/api";
import { CartService } from "../../services/CartService";

@Component({
    selector: "app-product-page",
    templateUrl: "./ProductPageComponent.html",
    styleUrls: ["./product-page.component.scss"],
    imports: [
        ProgressSpinner,
        Message,
        FormsModule,
        ProductImageComponent,
        Button,
        FaIconComponent,
        Rating,
        Card,
        StockStatusIndicatorComponent,
        ProductReviewsSummaryComponent,
        ProductReviewsListComponent,
        RelatedProductListComponent,
        RouterLink,
        Tag,
        ProductQuantitySelectorComponent,
    ],
})
export class ProductPageComponent implements OnInit {
    productRating: number = 3;
    isLoading = false;
    product: IProduct;
    productNotFound: boolean = false;
    relatedProducts: IProduct[] = [];
    productQuantity: number = 1;

    protected readonly faCartPlus: IconDefinition = faCartPlus;
    protected readonly faBoltLightning = faBoltLightning;
    private productSlug: string;
    private destroyRef: DestroyRef = inject(DestroyRef);

    constructor(
        private productService: ProductService,
        private route: ActivatedRoute,
        private messageService: MessageService,
        private cartService: CartService,
    ) {
        this.route.params
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((params) => {
                this.productSlug = params["slug"];
            });
    }

    onProductQuantityChange(quantity: number) {
        this.productQuantity = quantity;
    }

    addToCart(product: IProduct) {
        this.isLoading = true;
        const cartItem: IAddToCartItem = {
            inventoryItemId: product.id,
            quantity: this.productQuantity,
            overwriteQuantity: false,
        };
        console.log(cartItem);
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

    ngOnInit() {
        this.isLoading = true;
        this.productService
            .getProductBySlug(this.productSlug)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                catchError(() => {
                    this.productNotFound = true;
                    this.isLoading = false;
                    return [];
                }),
            )
            .subscribe({
                next: (product: IProduct) => {
                    this.product = product;
                    this.isLoading = false;
                },
            });
    }
}
