import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { IProduct } from "../../models/IProduct";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "../../services/ProductService";
import { ProgressSpinner } from "primeng/progressspinner";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { catchError } from "rxjs";
import { Message } from "primeng/message";
import { FormsModule } from "@angular/forms";
import { ProductImageComponent } from "../../components/product/ProductImage/ProductImageComponent";
import { Button } from "primeng/button";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { Select } from "primeng/select";
import { Rating } from "primeng/rating";
import { Card } from "primeng/card";
import { StockStatusIndicatorComponent } from "../../components/StockStatusIndicator/StockStatusIndicatorComponent";
import { ProductReviewsSummaryComponent } from "../../components/product/Reviews/Summary/ProductReviewsSummaryComponent";
import { ProductReviewsListComponent } from "../../components/product/Reviews/List/ProductReviewsListComponent";

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
        Select,
        Rating,
        Card,
        StockStatusIndicatorComponent,
        ProductReviewsSummaryComponent,
        ProductReviewsListComponent,
    ],
})
export class ProductPageComponent implements OnInit {
    productRating: number = 3;
    isLoading = false;
    product: IProduct;
    productNotFound: boolean = false;
    quantity: number = 1;
    quantityOptions: number[] = Array.from({ length: 50 }, (_, i) => i + 1);

    protected readonly faCartPlus = faCartPlus;
    private productSlug: string;
    private destroyRef: DestroyRef = inject(DestroyRef);

    constructor(
        private productService: ProductService,
        private route: ActivatedRoute,
    ) {
        this.route.params
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((params) => {
                this.productSlug = params["slug"];
            });
    }

    addToCart(product: IProduct) {
        console.log(product);
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
