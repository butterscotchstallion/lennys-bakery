import { Component } from "@angular/core";
import { PageHeaderComponent } from "../../components/PageHeader/PageHeaderComponent";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ProductService } from "../../services/ProductService";
import { IProduct } from "../../models/IProduct";
import { Subject } from "rxjs";
import { AdminEditInventoryItemComponent } from "../../components/Admin/Inventory/Form/AdminEditInventoryItemComponent";
import { CommonModule } from "@angular/common";

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
    product$: Subject<IProduct>;

    constructor(
        route: ActivatedRoute,
        private productService: ProductService,
    ) {
        const itemSlug: string = route.snapshot.paramMap.get("slug");
        if (itemSlug) {
            this.product$ = this.productService.getProductBySlug(itemSlug);
        }
    }
}
