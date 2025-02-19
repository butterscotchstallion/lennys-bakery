import { Component, DestroyRef, inject, Input, OnInit } from "@angular/core";
import { IProduct } from "../../../../models/IProduct";
import { InputText } from "primeng/inputtext";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { ProgressSpinner } from "primeng/progressspinner";
import { Textarea } from "primeng/textarea";
import { FileUpload, UploadEvent } from "primeng/fileupload";
import { Button } from "primeng/button";
import { MultiSelect } from "primeng/multiselect";
import { ITag } from "../../../../models/ITag";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { TagService } from "../../../../services/TagService";
import { ProductService } from "../../../../services/ProductService";
import { catchError, throwError } from "rxjs";
import { MessageService } from "primeng/api";
import { NgOptimizedImage } from "@angular/common";

@Component({
    selector: "app-admin-edit-inventory-item",
    templateUrl: "./AdminEditInventoryItemComponent.html",
    imports: [
        InputText,
        ProgressSpinner,
        ReactiveFormsModule,
        Textarea,
        FileUpload,
        Button,
        MultiSelect,
        NgOptimizedImage,
    ],
})
export class AdminEditInventoryItemComponent implements OnInit {
    @Input() item: IProduct;
    isLoading: boolean = false;
    itemForm: FormGroup;
    tagList: ITag[];
    private destroyRef: DestroyRef = inject(DestroyRef);

    constructor(
        private tagService: TagService,
        private productService: ProductService,
        private messageService: MessageService,
    ) {
        this.tagService
            .getTags()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((tags: ITag[]) => {
                this.tagList = tags;
            });
    }

    ngOnInit() {
        this.itemForm = new FormGroup({
            name: new FormControl<string>(this.item?.name || "", [
                Validators.required,
                Validators.minLength(3),
            ]),
            tags: new FormControl<ITag[]>(this.item?.tags || [], []),
            price: new FormControl<number>(this.item?.price || 0, [
                Validators.required,
            ]),
            description: new FormControl<string>(this.item?.description || "", [
                Validators.required,
                Validators.maxLength(1000),
            ]),
            shortDescription: new FormControl<string>(
                this.item?.shortDescription || "",
                [Validators.required, Validators.maxLength(255)],
            ),
            imageFilename: new FormControl(),
        });
    }

    onUploadItemImage(event: UploadEvent) {}

    save() {
        const product: IProduct = this.itemForm.value;
        this.isLoading = true;
        this.productService
            .updateProduct(product, this.item.slug)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                catchError(() => {
                    this.isLoading = false;
                    this.messageService.add({
                        severity: "error",
                        summary: "Error",
                        detail: "There was a problem updating the product.",
                    });
                    return throwError(() => "Failed to update product");
                }),
            )
            .subscribe(() => {
                this.isLoading = false;
                this.messageService.add({
                    severity: "success",
                    summary: "Success",
                    detail: "Product updated",
                    life: 3000,
                });
            });
    }
}
