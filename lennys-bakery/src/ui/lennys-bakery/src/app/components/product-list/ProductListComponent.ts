import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { catchError, map, Observable, of, tap } from "rxjs";
import { ProductService } from "../../services/ProductService";
import { IProduct } from "../../models/IProduct";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { ProductComponent } from "../product/ProductComponent";
import { ICart } from "../../models/ICart";
import { CartService } from "../../services/CartService";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Select } from "primeng/select";
import { FormsModule } from "@angular/forms";
import { Checkbox } from "primeng/checkbox";

@Component({
    selector: "app-product-list",
    templateUrl: "./ProductListComponent.html",
    styleUrls: [],
    imports: [
        NgIf,
        NgForOf,
        ProductComponent,
        AsyncPipe,
        Select,
        FormsModule,
        Checkbox,
    ],
})
export class ProductListComponent implements OnInit {
    products$: Observable<IProduct[]> = of([]);
    error: string | null = null;
    cartMap: Map<number, ICart> = new Map();
    sortOrder: string = "newest";
    filterOptions = [
        {
            label: "Jerky",
            id: "jerky",
        },
        {
            label: "Vegetarian",
            id: "vegetarian",
        },
        {
            label: "Vegan",
            id: "vegan",
        },
        {
            label: "Chicken",
            id: "chicken",
        },
        {
            label: "Salmon",
            id: "salmon",
        },
    ];
    sortOptions = [
        {
            label: "Newest",
            value: "newest",
        },
        {
            label: "Price: Low to High",
            value: "priceLowToHigh",
        },
        {
            label: "Price: High to Low",
            value: "priceHighToLow",
        },
        {
            label: "Best Selling",
            value: "bestSelling",
        },
        {
            label: "Top Rated",
            value: "topRated",
        },
    ];
    private destroyRef: DestroyRef = inject(DestroyRef);

    constructor(
        private productService: ProductService,
        private cartService: CartService,
    ) {}

    ngOnInit() {
        this.fetchProducts();
        this.cartService.cartMapUpdates$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((cartMap: Map<number, ICart>) => {
                this.cartMap = cartMap;
            });
    }

    fetchProducts() {
        this.products$ = this.productService.getProducts().pipe(
            map((products: IProduct[]) => {
                return products.map((product) => ({
                    ...product,
                    numReviews: Math.floor(Math.random() * 50) + 1,
                }));
            }),
            tap((_) => {
                this.cartService.getUserCart();
            }),
            catchError((err) => {
                console.error("Error fetching products:", err);
                this.error = "Failed to load products. Please try again later.";
                return of([]);
            }),
        );
    }
}
