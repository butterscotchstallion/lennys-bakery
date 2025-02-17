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
    ],
})
export class AdminEditInventoryItemComponent implements OnInit {
    @Input() item: IProduct;
    itemForm: FormGroup;
    tagList: ITag[];
    private destroyRef: DestroyRef = inject(DestroyRef);

    constructor(private tagService: TagService) {
        this.tagService
            .getTags()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((tags: ITag[]) => {
                this.tagList = tags;
            });
    }

    ngOnInit() {
        this.itemForm = new FormGroup({
            name: new FormControl(this.item?.name || "", [
                Validators.required,
                Validators.minLength(3),
            ]),
            tags: new FormControl(this.item?.tags || [], []),
            price: new FormControl(this.item?.price || "", [
                Validators.required,
            ]),
            description: new FormControl(this.item?.description || "", [
                Validators.required,
                Validators.maxLength(1000),
            ]),
            shortDescription: new FormControl(
                this.item?.shortDescription || "",
                [Validators.required, Validators.maxLength(255)],
            ),
            imageFilename: new FormControl(),
        });
    }

    onUploadItemImage(event: UploadEvent) {}

    save() {}
}
