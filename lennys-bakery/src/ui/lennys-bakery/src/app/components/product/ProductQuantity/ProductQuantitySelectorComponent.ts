import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Select } from "primeng/select";
import { FormsModule } from "@angular/forms";

interface IQuantityOption {
    label: string;
    value: number;
}

@Component({
    selector: "app-product-quantity-selector",
    templateUrl: "./ProductQuantitySelectorComponent.html",
    imports: [Select, FormsModule],
})
export class ProductQuantitySelectorComponent implements OnInit {
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    maxQuantity: number = 50;
    quantityOptions: IQuantityOption[] = [];
    itemQuantity: number = 1;

    constructor() {}

    onQuantityChange() {
        this.onChange.emit(this.itemQuantity);
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
