import { Component, DestroyRef, inject } from "@angular/core";
import { PageHeaderComponent } from "../../components/PageHeader/PageHeaderComponent";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ProductService } from "../../services/ProductService";
import { IProduct } from "../../models/IProduct";
import { AdminEditInventoryItemComponent } from "../../components/Admin/Inventory/Form/AdminEditInventoryItemComponent";
import { CommonModule } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { catchError, throwError } from "rxjs";
import { MessageService } from "primeng/api";

@Component({
    selector: "app-admin-page",
    templateUrl: "./AdminPageComponent.html",
    imports: [
        PageHeaderComponent,
        RouterLink,
        AdminEditInventoryItemComponent,
        CommonModule,
    ],
})
export class AdminPageComponent {
    product: IProduct;
    private destroyRef: DestroyRef = inject(DestroyRef);

    constructor(
        route: ActivatedRoute,
        private productService: ProductService,
        private messageService: MessageService,
    ) {
        const itemSlug: string = route.snapshot.paramMap.get("slug");
        if (itemSlug) {
            this.productService
                .getProductBySlug(itemSlug)
                .pipe(
                    takeUntilDestroyed(this.destroyRef),
                    catchError((_) => {
                        this.messageService.add({
                            severity: "error",
                            summary: "Error",
                            detail: "There was a problem fetching the product.",
                        });
                        return throwError(() => "Failed to load product");
                    }),
                )
                .subscribe((product: IProduct) => {
                    this.product = product;
                });
        }
    }
}
