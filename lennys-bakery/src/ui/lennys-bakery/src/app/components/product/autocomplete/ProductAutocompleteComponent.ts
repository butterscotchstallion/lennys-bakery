import { Component, DestroyRef, inject } from "@angular/core";
import { AutoComplete, AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { IProduct } from "../../../models/IProduct";
import { FormsModule } from "@angular/forms";
import { ProductAutocompleteService } from "../../../services/ProductAutocompleteService";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime } from "rxjs";
import { Router } from "@angular/router";

@Component({
    selector: "app-product-autocomplete",
    templateUrl: "./ProductAutocompleteComponent.html",
    imports: [AutoComplete, FormsModule],
})
export class ProductAutocompleteComponent {
    selectedProduct: IProduct;
    filteredProducts: IProduct[];
    private destroyRef: DestroyRef = inject(DestroyRef);

    constructor(
        private autocompleteService: ProductAutocompleteService,
        private router: Router,
    ) {}

    onSelect() {
        if (this.selectedProduct) {
            this.router.navigate([
                "/inventory/item/",
                this.selectedProduct.slug,
            ]);
        }
    }

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
