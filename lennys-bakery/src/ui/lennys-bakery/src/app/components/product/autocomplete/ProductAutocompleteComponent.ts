import { Component } from "@angular/core";
import { AutoComplete, AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { IProduct } from "../../../models/IProduct";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "app-product-autocomplete",
    templateUrl: "./ProductAutocompleteComponent.html",
    imports: [AutoComplete, FormsModule],
})
export class ProductAutocompleteComponent {
    selectedProduct: IProduct;
    filteredProducts: IProduct[];

    filterProducts($event: AutoCompleteCompleteEvent) {}
}
