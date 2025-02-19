import { Component, Input } from "@angular/core";
import { IProduct } from "../../../models/IProduct";

@Component({
    selector: "app-product-image",
    templateUrl: "./ProductImageComponent.html",
})
export class ProductImageComponent {
    @Input() product: IProduct;
    @Input() rounded: boolean = false;
}
