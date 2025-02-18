import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { catchError, debounceTime, map, of, tap, throwError } from "rxjs";
import { ProductService } from "../../services/ProductService";
import { IProduct } from "../../models/IProduct";
import { ICart } from "../../models/ICart";
import { CartService } from "../../services/CartService";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from "@angular/forms";
import { ProductCardComponent } from "../../components/product/Card/ProductCardComponent";
import { Select } from "primeng/select";
import { Checkbox, CheckboxChangeEvent } from "primeng/checkbox";
import { Skeleton } from "primeng/skeleton";
import { CommonModule } from "@angular/common";
import { TagService } from "../../services/TagService";
import { ITag } from "../../models/ITag";
import { MessageService } from "primeng/api";
import { Tag } from "primeng/tag";

@Component({
    selector: "app-product-list",
    templateUrl: "./ProductListPageComponent.html",
    styleUrls: [],
    imports: [
        FormsModule,
        ProductCardComponent,
        Select,
        Checkbox,
        Skeleton,
        CommonModule,
        ReactiveFormsModule,
        Tag,
    ],
})
export class ProductListPageComponent implements OnInit {
    isLoading: boolean = false;
    skeletonDebug: boolean = false;
    products: IProduct[] = [];
    error: string | null = null;
    cartMap: Map<number, ICart> = new Map();
    sortOrder: string = "newest";
    tagSearchForm: FormGroup;
    tags: ITag[] = [];
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
    selectedTagFilters: ITag[] = [];
    private selectedTagsMap: Map<string, boolean> = new Map();
    private tagNameTagMap: Map<string, ITag> = new Map();
    private destroyRef: DestroyRef = inject(DestroyRef);

    constructor(
        private productService: ProductService,
        private cartService: CartService,
        private tagService: TagService,
        private messageService: MessageService,
        private fb: FormBuilder,
    ) {}

    get tagFormControls() {
        return this.tagSearchForm.get("tags") as FormArray;
    }

    ngOnInit() {
        const tagNames: string[] = this.tags.map((tag) => tag.name);
        const tagControls: FormControl[] = this.tags.map((tag: ITag) => {
            return new FormControl(tagNames.includes(tag.name), []);
        });
        this.tagSearchForm = this.fb.group({
            tags: this.fb.array(tagControls, []),
        });
        this.fetchProducts();
        this.cartService.cartMapUpdates$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((cartMap: Map<number, ICart>) => {
                this.cartMap = cartMap;
            });
        this.tagService
            .getTags()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((tags: ITag[]) => {
                this.tags = tags;
                this.tags.map((tag: ITag) => {
                    this.tagNameTagMap.set(tag.name, tag);
                    this.tagFormControls.push(new FormControl(false));
                });
            });
    }

    filterProductsByTags(selectedTags: ITag[]) {
        this.products = [];
        this.isLoading = true;
        this.productService
            .getProductsWithTags(selectedTags)
            .pipe(
                debounceTime(3000),
                takeUntilDestroyed(this.destroyRef),
                catchError(() => {
                    this.isLoading = false;
                    this.messageService.add({
                        severity: "error",
                        summary: "Error",
                        detail: "There was a problem filtering products.",
                    });
                    return throwError(() => "Failed to filter products");
                }),
            )
            .subscribe((products: IProduct[]) => {
                this.isLoading = false;
                this.products = products;
            });
    }

    fetchProducts() {
        this.isLoading = true;
        this.productService
            .getProducts()
            .pipe(
                map((products: IProduct[]) => {
                    return products.map((product) => ({
                        ...product,
                        numReviews: Math.floor(Math.random() * 50) + 1,
                    }));
                }),
                tap((_) => {
                    /**
                     * Normally, the cart map is fetched when first visiting the page through
                     * the cart component. However, after navigating to the profile page, this
                     * data is gone. This means when returning to the product listing, the cart
                     * map is gone. So here we check if the cart map is empty, and only then we
                     * fetch the cart.
                     */
                    if (this.cartMap.size === 0) {
                        this.cartService.getUserCart();
                    }
                    this.isLoading = false;
                }),
                catchError((err) => {
                    console.error("Error fetching products:", err);
                    this.error =
                        "Failed to load products. Please try again later.";
                    return of([]);
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((products: IProduct[]) => {
                this.products = products;
            });
    }

    refresh() {
        this.fetchProducts();
    }

    clearFilters() {
        this.selectedTagFilters = [];
        this.selectedTagsMap.clear();
        this.tagFormControls.controls.forEach((control) => {
            control.setValue(false);
        });
        this.tagSearchForm.reset();
        this.fetchProducts();
    }

    onTagChange($event: CheckboxChangeEvent, tag: ITag) {
        this.selectedTagsMap.set(tag.name, $event.checked);
        const selectedTags: ITag[] = this.getSelectedTags();
        this.selectedTagFilters = selectedTags;
        this.filterProductsByTags(selectedTags);
    }

    onTagRemoved(tagName: string) {}

    private getSelectedTags(): ITag[] {
        const selectedTags: ITag[] = [];
        this.selectedTagsMap.forEach((isSelected: boolean, tagName: string) => {
            if (isSelected) {
                selectedTags.push(this.tagNameTagMap.get(tagName));
            }
        });
        selectedTags.sort((a, b) => a.name.localeCompare(b.name));
        return selectedTags;
    }
}
