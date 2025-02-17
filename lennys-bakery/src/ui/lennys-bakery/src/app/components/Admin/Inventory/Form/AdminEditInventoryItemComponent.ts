import { Component, Input, OnInit } from "@angular/core";
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

@Component({
    selector: "app-admin-edit-inventory-item",
    templateUrl: "./AdminEditInventoryItemComponent.html",
    imports: [
        InputText,
        ProgressSpinner,
        ReactiveFormsModule,
        Textarea,
        FileUpload,
    ],
})
export class AdminEditInventoryItemComponent implements OnInit {
    @Input() item: IProduct;
    itemForm: FormGroup;

    ngOnInit() {
        this.itemForm = new FormGroup({
            name: new FormControl(this.item?.name || "", [
                Validators.required,
                Validators.minLength(3),
            ]),
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
}
