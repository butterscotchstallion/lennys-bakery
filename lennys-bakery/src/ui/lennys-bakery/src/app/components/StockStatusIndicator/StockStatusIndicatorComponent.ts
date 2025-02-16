import { Component, Input } from "@angular/core";

@Component({
    selector: "app-stock-status-indicator",
    templateUrl: "./StockStatusIndicatorComponent.html",
})
export class StockStatusIndicatorComponent {
    @Input() inStock: boolean;
}
