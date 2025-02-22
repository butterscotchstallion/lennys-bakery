import { Component, ContentChild } from "@angular/core";
import { PageHeaderComponent } from "../../../components/PageHeader/PageHeaderComponent";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-admin-page-wrapper",
    templateUrl: "./AdminPageWrapperComponent.html",
    imports: [PageHeaderComponent, RouterLink],
})
export class AdminPageWrapperComponent {
    @ContentChild("content") content: any;
}
