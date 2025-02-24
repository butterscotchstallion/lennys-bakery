import { Component, Input } from "@angular/core";
import { GalleriaModule } from "primeng/galleria";
import { IProduct } from "../../../../models/IProduct";
import { NgOptimizedImage } from "@angular/common";

@Component({
    selector: "app-admin-inventory-images",
    templateUrl: "./AdminInventoryImagesComponent.html",
    imports: [GalleriaModule, NgOptimizedImage],
})
export class AdminInventoryImagesComponent {
    @Input() product: IProduct;
    responsiveOptions: any[] = [
        {
            breakpoint: "1300px",
            numVisible: 4,
        },
        {
            breakpoint: "575px",
            numVisible: 1,
        },
    ];
}
