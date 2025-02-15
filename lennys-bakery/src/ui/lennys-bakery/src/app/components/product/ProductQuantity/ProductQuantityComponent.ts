import { Component, Input, OnInit } from "@angular/core";
import { Select } from "primeng/select";
import { FormsModule } from "@angular/forms";
import { noop } from "rxjs";

@Component({
    selector: "app-product-quantity",
    templateUrl: "./ProductQuantityComponent.html",
    imports: [Select, FormsModule],
})
export class ProductQuantityComponent implements OnInit {
    @Input() onChange = noop;

    maxQuantity: number = 50;
    quantityOptions: any[] = [];

    onQuantityChange(event: any) {}

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
