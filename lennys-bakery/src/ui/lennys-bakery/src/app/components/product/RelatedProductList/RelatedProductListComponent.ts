import { Component, Input } from "@angular/core";
import { ProductCardComponent } from "../Card/ProductCardComponent";
import { IProduct } from "../../../models/IProduct";

@Component({
    selector: "app-related-product-list",
    templateUrl: "./RelatedProductListComponent.html",
    imports: [ProductCardComponent],
})
export class RelatedProductListComponent {
    @Input() products: IProduct[];
}
