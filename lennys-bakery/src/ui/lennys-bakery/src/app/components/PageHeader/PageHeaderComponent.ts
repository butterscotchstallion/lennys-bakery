import { Component, Input } from "@angular/core";

@Component({
    selector: "app-page-header",
    templateUrl: "./PageHeaderComponent.html",
})
export class PageHeaderComponent {
    @Input() headerText: string;
}
