import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { IProduct } from "../../models/IProduct";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "../../services/ProductService";
import { ProgressSpinner } from "primeng/progressspinner";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { catchError } from "rxjs";
import { Message } from "primeng/message";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "app-product-page",
    templateUrl: "./product-page.component.html",
    styleUrls: ["./product-page.component.scss"],
    imports: [ProgressSpinner, Message, FormsModule],
})
export class ProductPageComponent implements OnInit {
    product: IProduct;
    productNotFound: boolean = false;
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

    ngOnInit() {
        this.productService
            .getProductBySlug(this.productSlug)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                catchError(() => {
                    this.productNotFound = true;
                    return [];
                }),
            )
            .subscribe({
                next: (product: IProduct) => {
                    this.product = product;
                },
            });
    }
}
