import { Component, DestroyRef, inject } from "@angular/core";
import { AutoComplete, AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { IProduct } from "../../../models/IProduct";
import { FormsModule } from "@angular/forms";
import { ProductAutocompleteService } from "../../../services/ProductAutocompleteService";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime } from "rxjs";

@Component({
    selector: "app-product-autocomplete",
    templateUrl: "./ProductAutocompleteComponent.html",
    imports: [AutoComplete, FormsModule],
})
export class ProductAutocompleteComponent {
    query: string;
    filteredProducts: IProduct[];
    private destroyRef: DestroyRef = inject(DestroyRef);

    constructor(private autocompleteService: ProductAutocompleteService) {}

    filterProducts(event: AutoCompleteCompleteEvent) {
        this.autocompleteService
            .getSuggestions(event.query)
            .pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (products: IProduct[]) => {
                    this.filteredProducts = products;
                },
                error: () => {
                    this.filteredProducts = [];
                },
            });
    }
}
