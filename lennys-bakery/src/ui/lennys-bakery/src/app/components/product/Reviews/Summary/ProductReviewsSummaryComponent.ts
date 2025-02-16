import { Component, Input } from "@angular/core";
import { Rating } from "primeng/rating";
import { FormsModule } from "@angular/forms";
import { IProduct } from "../../../../models/IProduct";
import { ProgressBar, ProgressBarModule } from "primeng/progressbar";

@Component({
    selector: "app-product-reviews-summary",
    templateUrl: "./ProductReviewsSummaryComponent.html",
    imports: [Rating, FormsModule, ProgressBarModule, ProgressBar],
    styleUrls: ["./ProductReviewsSummaryComponent.scss"],
})
export class ProductReviewsSummaryComponent {
    @Input() product: IProduct;
    averageProductRating: number = 4.5;
    ratings = [
        { rating: 5, percentage: 81 },
        { rating: 4, percentage: 8 },
        { rating: 3, percentage: 3 },
        { rating: 2, percentage: 2 },
        { rating: 1, percentage: 7 },
    ];
}
